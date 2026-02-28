import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/d1';
import { addCourseSchema } from '@/lib/validators';
import { hashPassword, getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthUser(req);

    if (!auth) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const session = searchParams.get('session');

    const db = await getDB();

    let results;
    if (session) {
      ({ results } = await db
        .prepare(
          'SELECT id AS _id, course_code AS courseCode, course_title AS courseTitle, teacher_name AS teacherName, session, year, semester, created_at AS createdAt, updated_at AS updatedAt FROM courses WHERE session = ?'
        )
        .bind(session)
        .all());
    } else {
      ({ results } = await db
        .prepare(
          'SELECT id AS _id, course_code AS courseCode, course_title AS courseTitle, teacher_name AS teacherName, session, year, semester, created_at AS createdAt, updated_at AS updatedAt FROM courses'
        )
        .all());
    }

    return NextResponse.json({ success: true, courses: results });
  } catch (error: unknown) {
    console.error('Get courses error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthUser(req);

    if (auth?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: admin role required' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const parsed = addCourseSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const db = await getDB();
    const hashedPassword = await hashPassword(parsed.data.password);

    try {
      const course = await db
        .prepare(
          'INSERT INTO courses (id, course_code, course_title, teacher_name, session, password, year, semester) VALUES (hex(randomblob(12)), ?, ?, ?, ?, ?, ?, ?) RETURNING id AS _id, course_code AS courseCode, course_title AS courseTitle, teacher_name AS teacherName, session, year, semester, created_at AS createdAt, updated_at AS updatedAt'
        )
        .bind(
          parsed.data.courseCode.toUpperCase(),
          parsed.data.courseTitle,
          parsed.data.teacherName,
          parsed.data.session,
          hashedPassword,
          parsed.data.year ?? null,
          parsed.data.semester ?? null
        )
        .first();

      return NextResponse.json({ success: true, course }, { status: 201 });
    } catch (e: unknown) {
      if (String(e).includes('UNIQUE constraint failed')) {
        return NextResponse.json(
          { error: 'Course with this code and session already exists' },
          { status: 409 }
        );
      }
      throw e;
    }
  } catch (error: unknown) {
    console.error('Create course error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
