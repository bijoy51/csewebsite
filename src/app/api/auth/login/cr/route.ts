import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import CR from '@/lib/models/CR';
import { comparePassword, signToken } from '@/lib/auth';
import { crLoginSchema } from '@/lib/validators';
import { COOKIE_NAME } from '@/lib/constants';

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

    await dbConnect();

    const { session, roll, password } = parsed.data;
    const cr = await CR.findOne({ session, roll });

    if (!cr || !(await comparePassword(password, cr.password))) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = signToken({
      id: cr._id.toString(),
      role: 'cr',
      session: cr.session,
      roll: cr.roll,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: cr._id,
        name: cr.name,
        role: 'cr',
        session: cr.session,
        roll: cr.roll,
      },
    });

    response.cookies.set(COOKIE_NAME, token, {
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
