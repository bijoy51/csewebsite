import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Course from '@/lib/models/Course';
import { comparePassword, signToken } from '@/lib/auth';
import { teacherLoginSchema } from '@/lib/validators';
import { COOKIE_NAME } from '@/lib/constants';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = teacherLoginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    await dbConnect();

    const { session, courseCode, password } = parsed.data;
    const course = await Course.findOne({
      courseCode: courseCode.toUpperCase(),
      session,
    });

    if (!course || !(await comparePassword(password, course.password))) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = signToken({
      id: course._id.toString(),
      role: 'teacher',
      session: course.session,
      courseCode: course.courseCode,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: course._id,
        name: course.teacherName,
        role: 'teacher',
        courseCode: course.courseCode,
        courseTitle: course.courseTitle,
        session: course.session,
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
    console.error('Teacher login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
