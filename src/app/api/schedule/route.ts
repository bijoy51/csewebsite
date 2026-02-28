import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/d1';
import { createScheduleSchema } from '@/lib/validators';
import { getAuthUser } from '@/lib/auth';

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
          'SELECT id AS _id, course_code AS courseCode, session, date, time, room, created_at AS createdAt, updated_at AS updatedAt FROM class_schedules WHERE session = ? ORDER BY date DESC'
        )
        .bind(session)
        .all());
    } else {
      ({ results } = await db
        .prepare(
          'SELECT id AS _id, course_code AS courseCode, session, date, time, room, created_at AS createdAt, updated_at AS updatedAt FROM class_schedules ORDER BY date DESC'
        )
        .all());
    }

    return NextResponse.json({ success: true, schedules: results });
  } catch (error: unknown) {
    console.error('Get schedule error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthUser(req);

    if (!auth || !['teacher', 'admin'].includes(auth.role)) {
      return NextResponse.json(
        { error: 'Forbidden: teacher or admin role required' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const parsed = createScheduleSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const db = await getDB();

    const schedule = await db
      .prepare(
        'INSERT INTO class_schedules (id, course_code, session, date, time, room) VALUES (hex(randomblob(12)), ?, ?, ?, ?, ?) RETURNING id AS _id, course_code AS courseCode, session, date, time, room, created_at AS createdAt, updated_at AS updatedAt'
      )
      .bind(
        parsed.data.courseCode.toUpperCase(),
        parsed.data.session,
        parsed.data.date,
        parsed.data.time,
        parsed.data.room ?? ''
      )
      .first();

    return NextResponse.json({ success: true, schedule }, { status: 201 });
  } catch (error: unknown) {
    console.error('Create schedule error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
