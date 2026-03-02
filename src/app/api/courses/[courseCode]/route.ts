import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/d1';
import { getAuthUser, verifyToken } from '@/lib/auth';
import { COOKIE_NAMES } from '@/lib/constants';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ courseCode: string }> }
) {
  try {
    const { courseCode } = await params;
    const auth = getAuthUser(req);

    if (!auth) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const session = searchParams.get('session');

    const db = await getDB();

    let course;
    if (session) {
      course = await db
        .prepare(
          'SELECT id AS _id, course_code AS courseCode, course_title AS courseTitle, teacher_name AS teacherName, session, year, semester, created_at AS createdAt, updated_at AS updatedAt FROM courses WHERE course_code = ? AND session = ?'
        )
        .bind(courseCode.toUpperCase(), session)
        .first();
    } else {
      course = await db
        .prepare(
          'SELECT id AS _id, course_code AS courseCode, course_title AS courseTitle, teacher_name AS teacherName, session, year, semester, created_at AS createdAt, updated_at AS updatedAt FROM courses WHERE course_code = ?'
        )
        .bind(courseCode.toUpperCase())
        .first();
    }

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, course });
  } catch (error: unknown) {
    console.error('Get course error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ courseCode: string }> }
) {
  try {
    const { courseCode } = await params;
    const adminToken = req.cookies.get(COOKIE_NAMES.admin)?.value;
    const auth = adminToken ? verifyToken(adminToken) : null;

    if (!auth || auth.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: admin role required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const session = searchParams.get('session');

    const db = await getDB();

    let result;
    if (session) {
      result = await db
        .prepare('DELETE FROM courses WHERE course_code = ? AND session = ?')
        .bind(courseCode.toUpperCase(), session)
        .run();
    } else {
      result = await db
        .prepare('DELETE FROM courses WHERE course_code = ?')
        .bind(courseCode.toUpperCase())
        .run();
    }

    if (!result.meta.changes) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Course deleted successfully' });
  } catch (error: unknown) {
    console.error('Delete course error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
