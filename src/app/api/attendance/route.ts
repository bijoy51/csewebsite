import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/d1';
import { markAttendanceSchema } from '@/lib/validators';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthUser(req);

    if (!auth || !['teacher', 'cr'].includes(auth.role)) {
      return NextResponse.json(
        { error: 'Forbidden: teacher or cr role required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const courseCode = searchParams.get('courseCode');
    const session = searchParams.get('session');
    const date = searchParams.get('date');

    const db = await getDB();

    const conditions: string[] = [];
    const bindings: unknown[] = [];

    if (courseCode) { conditions.push('a.course_code = ?'); bindings.push(courseCode.toUpperCase()); }
    if (session) { conditions.push('a.session = ?'); bindings.push(session); }
    if (date) { conditions.push('a.date = ?'); bindings.push(date); }

    const where = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

    const { results } = await db
      .prepare(
        'SELECT a.id AS _id, a.course_code AS courseCode, a.session, a.date, a.status, a.marked_by AS markedBy, ' +
        "json_object('_id', s.id, 'name', s.name, 'roll', s.roll, 'registrationNo', s.registration_no, 'session', s.session, 'email', s.email) AS studentId " +
        'FROM attendance a LEFT JOIN students s ON a.student_id = s.id ' + where
      )
      .bind(...bindings)
      .all();

    const records = results.map((r: Record<string, unknown>) => ({
      ...r,
      studentId: typeof r.studentId === 'string' ? JSON.parse(r.studentId as string) : r.studentId,
    }));

    return NextResponse.json({ success: true, records });
  } catch (error: unknown) {
    console.error('Get attendance error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthUser(req);

    if (!auth || !['teacher', 'cr'].includes(auth.role)) {
      return NextResponse.json(
        { error: 'Forbidden: teacher or cr role required' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const parsed = markAttendanceSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const db = await getDB();
    const { courseCode, session, date, records } = parsed.data;
    const markedBy = auth.role as 'teacher' | 'cr';
    const code = courseCode.toUpperCase();

    // Batch-fetch all existing records in one query
    const studentIds = records.map((r) => r.studentId);
    const placeholders = studentIds.map(() => '?').join(',');
    const { results: existingRows } = await db
      .prepare(`SELECT id, student_id FROM attendance WHERE course_code = ? AND date = ? AND student_id IN (${placeholders})`)
      .bind(code, date, ...studentIds)
      .all();

    const existingMap = new Map(existingRows.map((r: Record<string, unknown>) => [r.student_id as string, r.id as string]));

    // Build batch of all upsert statements
    const statements = [];
    let upserted = 0;
    let modified = 0;

    for (const record of records) {
      const existingId = existingMap.get(record.studentId);
      if (existingId) {
        statements.push(
          db.prepare("UPDATE attendance SET status = ?, marked_by = ?, session = ?, updated_at = datetime('now') WHERE id = ?")
            .bind(record.status, markedBy, session, existingId)
        );
        modified++;
      } else {
        statements.push(
          db.prepare('INSERT INTO attendance (id, student_id, course_code, session, date, status, marked_by) VALUES (hex(randomblob(12)), ?, ?, ?, ?, ?, ?)')
            .bind(record.studentId, code, session, date, record.status, markedBy)
        );
        upserted++;
      }
    }

    if (statements.length > 0) {
      await db.batch(statements);
    }

    return NextResponse.json({
      success: true,
      message: 'Attendance marked successfully',
      result: { upserted, modified },
    });
  } catch (error: unknown) {
    console.error('Mark attendance error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
