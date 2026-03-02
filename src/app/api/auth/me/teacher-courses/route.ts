import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/d1';
import { verifyToken } from '@/lib/auth';
import { COOKIE_NAMES } from '@/lib/constants';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(COOKIE_NAMES.teacher)?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload || payload.role !== 'teacher') {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get the teacher name from the JWT or fall back to DB lookup
    let teacherName = payload.teacherName;

    if (!teacherName && payload.id) {
      const db = await getDB();
      const course = await db
        .prepare('SELECT teacher_name FROM courses WHERE id = ?')
        .bind(payload.id)
        .first();
      teacherName = course?.teacher_name as string;
    }

    if (!teacherName) {
      return NextResponse.json({ error: 'Teacher not found' }, { status: 404 });
    }

    const db = await getDB();
    const { results } = await db
      .prepare(
        'SELECT id AS _id, course_code AS courseCode, course_title AS courseTitle, session FROM courses WHERE teacher_name = ? ORDER BY session DESC, course_code'
      )
      .bind(teacherName)
      .all();

    return NextResponse.json({
      success: true,
      courses: results,
      currentCourseId: payload.id,
    });
  } catch (error: unknown) {
    console.error('Teacher courses error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
