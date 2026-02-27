import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Student from '@/lib/models/Student';
import { comparePassword, signToken } from '@/lib/auth';
import { studentLoginSchema } from '@/lib/validators';
import { COOKIE_NAME } from '@/lib/constants';

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

    await dbConnect();

    const { email, password } = parsed.data;
    const student = await Student.findOne({ email });

    if (!student || !(await comparePassword(password, student.password))) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const token = signToken({
      id: student._id.toString(),
      role: 'student',
      session: student.session,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: student._id,
        name: student.name,
        email: student.email,
        role: 'student',
        session: student.session,
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
    console.error('Student login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
