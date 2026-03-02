import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/d1';
import { comparePassword, signToken } from '@/lib/auth';
import { crLoginSchema } from '@/lib/validators';
import { COOKIE_NAMES } from '@/lib/constants';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = crLoginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const db = await getDB();
    const { session, roll, password } = parsed.data;

    const cr = await db
      .prepare('SELECT id, name, session, roll, password FROM crs WHERE session = ? AND roll = ?')
      .bind(session, roll)
      .first();

    if (!cr || !(await comparePassword(password, cr.password as string))) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = signToken({
      id: cr.id as string,
      role: 'cr',
      session: cr.session as string,
      roll: cr.roll as string,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: cr.id,
        name: cr.name,
        role: 'cr',
        session: cr.session,
        roll: cr.roll,
      },
    });

    response.cookies.set(COOKIE_NAMES.cr, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    return response;
  } catch (error: unknown) {
    console.error('CR login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
