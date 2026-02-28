import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/d1';
import { createTutorialSchema } from '@/lib/validators';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthUser(req);

    if (!auth) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const courseCode = searchParams.get('courseCode');
    const session = searchParams.get('session');

    const db = await getDB();

    const conditions: string[] = [];
    const bindings: unknown[] = [];
    if (courseCode) { conditions.push('course_code = ?'); bindings.push(courseCode.toUpperCase()); }
    if (session) { conditions.push('session = ?'); bindings.push(session); }

    const where = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

    const { results } = await db
      .prepare(
        'SELECT id AS _id, course_code AS courseCode, session, tutorial_number AS tutorialNumber, topic, date, created_at AS createdAt, updated_at AS updatedAt FROM tutorials ' + where + ' ORDER BY tutorial_number ASC'
      )
      .bind(...bindings)
      .all();

    return NextResponse.json({ success: true, tutorials: results });
  } catch (error: unknown) {
    console.error('Get tutorials error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthUser(req);

    if (auth?.role !== 'teacher') {
      return NextResponse.json(
        { error: 'Forbidden: teacher role required' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const parsed = createTutorialSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const db = await getDB();

    try {
      const tutorial = await db
        .prepare(
          'INSERT INTO tutorials (id, course_code, session, tutorial_number, topic, date) VALUES (hex(randomblob(12)), ?, ?, ?, ?, ?) RETURNING id AS _id, course_code AS courseCode, session, tutorial_number AS tutorialNumber, topic, date, created_at AS createdAt, updated_at AS updatedAt'
        )
        .bind(
          parsed.data.courseCode.toUpperCase(),
          parsed.data.session,
          parsed.data.tutorialNumber,
          parsed.data.topic,
          parsed.data.date ?? null
        )
        .first();

      return NextResponse.json({ success: true, tutorial }, { status: 201 });
    } catch (e: unknown) {
      if (String(e).includes('UNIQUE constraint failed')) {
        return NextResponse.json(
          { error: 'Tutorial with this number already exists for this course and session' },
          { status: 409 }
        );
      }
      throw e;
    }
  } catch (error: unknown) {
    console.error('Create tutorial error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
