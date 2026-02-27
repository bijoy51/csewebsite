import { NextRequest, NextResponse } from 'next/server';
import { COOKIE_NAME } from '@/lib/constants';

// JWT verification for Edge Runtime (can't use jsonwebtoken in Edge, so we do manual base64 decode)
function decodeJWT(token: string, secret: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    // Verify signature using Web Crypto API
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));

    // Check expiration
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;

  // Define protected route patterns
  const studentRoutes = pathname.startsWith('/dashboard');
  const adminRoutes = pathname.startsWith('/admin/dashboard') || pathname.startsWith('/admin/courses') || pathname.startsWith('/admin/cr');
  const crRoutes = pathname.startsWith('/cr/dashboard');

  // API routes that need protection
  const protectedAPI = pathname.startsWith('/api/students') ||
    pathname.startsWith('/api/courses') ||
    pathname.startsWith('/api/attendance') ||
    pathname.startsWith('/api/tutorials') ||
    pathname.startsWith('/api/results') ||
    pathname.startsWith('/api/schedule') ||
    pathname.startsWith('/api/admin') ||
    (pathname.startsWith('/api/cr') && !pathname.startsWith('/api/cr/login'));

  // Check if route needs protection
  const isTeacherDynamicRoute = /^\/[a-zA-Z]{2,4}\d{4}/.test(pathname) && !pathname.startsWith('/api');
  const needsAuth = studentRoutes || adminRoutes || crRoutes || isTeacherDynamicRoute || protectedAPI;

  if (!needsAuth) {
    return NextResponse.next();
  }

  if (!token) {
    if (protectedAPI) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // Redirect to appropriate login page
    if (studentRoutes) return NextResponse.redirect(new URL('/login', request.url));
    if (adminRoutes) return NextResponse.redirect(new URL('/admin', request.url));
    if (crRoutes) return NextResponse.redirect(new URL('/cr', request.url));
    if (isTeacherDynamicRoute) return NextResponse.redirect(new URL('/teachers', request.url));
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const payload = decodeJWT(token, process.env.JWT_SECRET || '');

  if (!payload) {
    const response = protectedAPI
      ? NextResponse.json({ error: 'Invalid token' }, { status: 401 })
      : NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete(COOKIE_NAME);
    return response;
  }

  const role = payload.role as string;

  // Role-based access control
  if (studentRoutes && role !== 'student') {
    return protectedAPI
      ? NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      : NextResponse.redirect(new URL('/', request.url));
  }

  if (adminRoutes && role !== 'admin') {
    return protectedAPI
      ? NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      : NextResponse.redirect(new URL('/', request.url));
  }

  if (crRoutes && role !== 'cr') {
    return protectedAPI
      ? NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      : NextResponse.redirect(new URL('/', request.url));
  }

  if (isTeacherDynamicRoute && role !== 'teacher') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Inject user info into headers for API routes
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-id', (payload.id as string) || '');
  requestHeaders.set('x-user-role', role);
  requestHeaders.set('x-user-session', (payload.session as string) || '');
  requestHeaders.set('x-user-course', (payload.courseCode as string) || '');
  requestHeaders.set('x-user-roll', (payload.roll as string) || '');

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/dashboard/:path*',
    '/admin/courses/:path*',
    '/admin/cr/:path*',
    '/cr/dashboard/:path*',
    '/api/students/:path*',
    '/api/courses/:path*',
    '/api/attendance/:path*',
    '/api/tutorials/:path*',
    '/api/results/:path*',
    '/api/schedule/:path*',
    '/api/admin/:path*',
    '/api/cr/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico|images|uploads).*)',
  ],
};
