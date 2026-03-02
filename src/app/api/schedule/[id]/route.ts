import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/d1';
import { updateScheduleSchema } from '@/lib/validators';
import { getAuthUser } from '@/lib/auth';

const SELECT_COLS =
  'id AS _id, course_code AS courseCode, session, date, time, room, teacher_name AS teacherName, topic, created_at AS createdAt, updated_at AS updatedAt';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = getAuthUser(req);

    if (!auth || !['teacher', 'admin', 'cr'].includes(auth.role)) {
      return NextResponse.json(
        { error: 'Forbidden: teacher, cr, or admin role required' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await req.json();
    const parsed = updateScheduleSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const db = await getDB();

    // Build dynamic SET clause
    const setClauses: string[] = [];
    const binds: unknown[] = [];

    if (parsed.data.date !== undefined) {
      setClauses.push('date = ?');
      binds.push(parsed.data.date);
    }
    if (parsed.data.time !== undefined) {
      setClauses.push('time = ?');
      binds.push(parsed.data.time);
    }
    if (parsed.data.room !== undefined) {
      setClauses.push('room = ?');
      binds.push(parsed.data.room);
    }
    if (parsed.data.teacherName !== undefined) {
      setClauses.push('teacher_name = ?');
      binds.push(parsed.data.teacherName);
    }
    if (parsed.data.topic !== undefined) {
      setClauses.push('topic = ?');
      binds.push(parsed.data.topic);
    }

    if (setClauses.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    setClauses.push("updated_at = datetime('now')");
    binds.push(id);

    const schedule = await db
      .prepare(
        `UPDATE class_schedules SET ${setClauses.join(', ')} WHERE id = ? RETURNING ${SELECT_COLS}`
      )
      .bind(...binds)
      .first();

    if (!schedule) {
      return NextResponse.json({ error: 'Schedule not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, schedule });
  } catch (error: unknown) {
    console.error('Update schedule error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = getAuthUser(req);

    if (!auth || !['teacher', 'admin', 'cr'].includes(auth.role)) {
      return NextResponse.json(
        { error: 'Forbidden: teacher, cr, or admin role required' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const db = await getDB();

    const deleted = await db
      .prepare(`DELETE FROM class_schedules WHERE id = ? RETURNING ${SELECT_COLS}`)
      .bind(id)
      .first();

    if (!deleted) {
      return NextResponse.json({ error: 'Schedule not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Delete schedule error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
