import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/d1';
import { comparePassword, signToken } from '@/lib/auth';
import { studentLoginSchema } from '@/lib/validators';
import { COOKIE_NAMES } from '@/lib/constants';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = studentLoginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const db = await getDB();
    const { email, password } = parsed.data;

    const student = await db
      .prepare('SELECT id, name, email, password, session FROM students WHERE email = ?')
      .bind(email)
      .first();

    if (!student || !(await comparePassword(password, student.password as string))) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const token = signToken({
      id: student.id as string,
      role: 'student',
      session: student.session as string,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: student.id,
        name: student.name,
        email: student.email,
        role: 'student',
        session: student.session,
      },
    });

    response.cookies.set(COOKIE_NAMES.student, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    return response;
  } catch (error: unknown) {
    console.error('Student login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
