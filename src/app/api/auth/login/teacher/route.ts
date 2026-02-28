import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/d1';
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

    const db = await getDB();
    const { session, courseCode, password } = parsed.data;

    const course = await db
      .prepare('SELECT id, course_code, course_title, teacher_name, session, password FROM courses WHERE course_code = ? AND session = ?')
      .bind(courseCode.toUpperCase(), session)
      .first();

    if (!course || !(await comparePassword(password, course.password as string))) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = signToken({
      id: course.id as string,
      role: 'teacher',
      session: course.session as string,
      courseCode: course.course_code as string,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: course.id,
        name: course.teacher_name,
        role: 'teacher',
        courseCode: course.course_code,
        courseTitle: course.course_title,
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
