import { NextRequest, NextResponse } from 'next/server';
import { COOKIE_NAMES } from '@/lib/constants';

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const role = searchParams.get('role');
  const response = NextResponse.json({ success: true });

  if (role && COOKIE_NAMES[role]) {
    // Delete only the specific role cookie
    response.cookies.delete(COOKIE_NAMES[role]);
  } else {
    // Delete all role cookies
    for (const name of Object.values(COOKIE_NAMES)) {
      response.cookies.delete(name);
    }
  }

  return response;
}
