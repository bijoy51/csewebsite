import { NextRequest, NextResponse } from 'next/server';

// Role-specific cookie names (must match constants.ts)
const COOKIE_NAMES: Record<string, string> = {
  student: 'cse-auth-student',
  admin: 'cse-auth-admin',
  teacher: 'cse-auth-teacher',
  cr: 'cse-auth-cr',
};

// Lightweight JWT decode — only checks expiration, no crypto.
// Full verification happens in API routes via getAuthUser().
function decodeJWT(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Determine which protected zone this request belongs to
  let requiredRole: string | null = null;
  let loginUrl = '/login';

  if (pathname.startsWith('/dashboard')) {
    requiredRole = 'student';
    loginUrl = '/login';
  } else if (pathname.startsWith('/admin/dashboard') || pathname.startsWith('/admin/courses') || pathname.startsWith('/admin/cr') || pathname.startsWith('/admin/students')) {
    requiredRole = 'admin';
    loginUrl = '/admin';
  } else if (pathname.startsWith('/cr/dashboard')) {
    requiredRole = 'cr';
    loginUrl = '/cr';
  }

  // Not a protected page — skip entirely
  if (!requiredRole) return NextResponse.next();

  // Check the role-specific cookie
  const cookieName = COOKIE_NAMES[requiredRole];
  const token = request.cookies.get(cookieName)?.value;

  // No token — redirect to login
  if (!token) {
    return NextResponse.redirect(new URL(loginUrl, request.url));
  }

  const payload = decodeJWT(token);

  if (!payload) {
    const response = NextResponse.redirect(new URL(loginUrl, request.url));
    response.cookies.delete(cookieName);
    return response;
  }

  // Wrong role in token — redirect to login
  if (payload.role !== requiredRole) {
    return NextResponse.redirect(new URL(loginUrl, request.url));
  }

  return NextResponse.next();
}

// CRITICAL: Only match protected page routes.
// Public pages (/login, /register, /) and API routes are NOT matched,
// so they skip middleware entirely — saving CPU time on the Worker.
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/dashboard/:path*',
    '/admin/courses/:path*',
    '/admin/cr/:path*',
    '/admin/students/:path*',
    '/cr/dashboard/:path*',
  ],
};
