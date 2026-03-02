import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/d1';
import { createScheduleSchema } from '@/lib/validators';
import { getAuthUser } from '@/lib/auth';

const SELECT_COLS =
  'id AS _id, course_code AS courseCode, session, date, time, room, teacher_name AS teacherName, topic, created_at AS createdAt, updated_at AS updatedAt';

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthUser(req);

    if (!auth) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const session = searchParams.get('session');
    const courseCode = searchParams.get('courseCode');

    const db = await getDB();

    let query = `SELECT ${SELECT_COLS} FROM class_schedules`;
    const conditions: string[] = [];
    const binds: string[] = [];

    if (session) {
      conditions.push('session = ?');
      binds.push(session);
    }
    if (courseCode) {
      conditions.push('course_code = ?');
      binds.push(courseCode);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    query += ' ORDER BY date DESC';

    const { results } = await db.prepare(query).bind(...binds).all();

    return NextResponse.json({ success: true, schedules: results });
  } catch (error: unknown) {
    console.error('Get schedule error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthUser(req);

    if (!auth || !['teacher', 'admin', 'cr'].includes(auth.role)) {
      return NextResponse.json(
        { error: 'Forbidden: teacher, cr, or admin role required' },
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
        `INSERT INTO class_schedules (id, course_code, session, date, time, room, teacher_name, topic) VALUES (hex(randomblob(12)), ?, ?, ?, ?, ?, ?, ?) RETURNING ${SELECT_COLS}`
      )
      .bind(
        parsed.data.courseCode.toUpperCase(),
        parsed.data.session,
        parsed.data.date,
        parsed.data.time,
        parsed.data.room ?? '',
        parsed.data.teacherName ?? '',
        parsed.data.topic ?? ''
      )
      .first();

    return NextResponse.json({ success: true, schedule }, { status: 201 });
  } catch (error: unknown) {
    console.error('Create schedule error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
