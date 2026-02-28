import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/d1';
import { getAuthUser } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ courseCode: string }> }
) {
  try {
    const { courseCode } = await params;
    const auth = getAuthUser(req);

    if (!auth || !['teacher', 'cr'].includes(auth.role)) {
      return NextResponse.json(
        { error: 'Forbidden: teacher or cr role required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const session = searchParams.get('session');

    const db = await getDB();

    let course;
    if (session) {
      course = await db
        .prepare('SELECT session FROM courses WHERE course_code = ? AND session = ?')
        .bind(courseCode.toUpperCase(), session)
        .first();
    } else {
      course = await db
        .prepare('SELECT session FROM courses WHERE course_code = ?')
        .bind(courseCode.toUpperCase())
        .first();
    }

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const { results } = await db
      .prepare(
        'SELECT id AS _id, name, roll, registration_no AS registrationNo, session, email, profile_photo AS profilePhoto, phone, blood_group AS bloodGroup, address, created_at AS createdAt, updated_at AS updatedAt FROM students WHERE session = ? ORDER BY roll ASC'
      )
      .bind(course.session as string)
      .all();

    return NextResponse.json({ success: true, students: results });
  } catch (error: unknown) {
    console.error('Get course students error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
