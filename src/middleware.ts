import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip API routes — they need fresh data every time
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  const res = NextResponse.next();

  // All page routes are 'use client' — the server only returns a static HTML shell.
  // Cache at Cloudflare edge to avoid Worker execution on every request.
  // stale-while-revalidate lets edge serve stale cache while fetching fresh in background.
  res.headers.set('CDN-Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
  res.headers.set('Cache-Control', 'public, max-age=0, must-revalidate');

  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images|uploads).*)'],
};
