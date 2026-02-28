import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/d1';
import { markTutorialResultsSchema } from '@/lib/validators';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthUser(req);

    if (auth?.role !== 'teacher') {
      return NextResponse.json(
        { error: 'Forbidden: teacher role required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const courseCode = searchParams.get('courseCode');
    const session = searchParams.get('session');

    const db = await getDB();

    const conditions: string[] = [];
    const bindings: unknown[] = [];
    if (courseCode) { conditions.push('tr.course_code = ?'); bindings.push(courseCode.toUpperCase()); }
    if (session) { conditions.push('tr.session = ?'); bindings.push(session); }

    const where = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

    const { results } = await db
      .prepare(
        'SELECT tr.id AS _id, tr.course_code AS courseCode, tr.session, tr.tutorial_number AS tutorialNumber, tr.marks, tr.total_marks AS totalMarks, tr.attended, ' +
        "json_object('_id', s.id, 'name', s.name, 'roll', s.roll, 'registrationNo', s.registration_no, 'session', s.session, 'email', s.email) AS studentId " +
        'FROM tutorial_results tr LEFT JOIN students s ON tr.student_id = s.id ' +
        where + ' ORDER BY tr.tutorial_number ASC'
      )
      .bind(...bindings)
      .all();

    const parsedResults = results.map((r: Record<string, unknown>) => ({
      ...r,
      attended: Boolean(r.attended),
      studentId: typeof r.studentId === 'string' ? JSON.parse(r.studentId as string) : r.studentId,
    }));

    return NextResponse.json({ success: true, results: parsedResults });
  } catch (error: unknown) {
    console.error('Get tutorial results error:', error);
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
    const parsed = markTutorialResultsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const db = await getDB();
    const { courseCode, session, tutorialNumber, records } = parsed.data;
    const code = courseCode.toUpperCase();

    // Batch-fetch all existing records in one query
    const studentIds = records.map((r) => r.studentId);
    const placeholders = studentIds.map(() => '?').join(',');
    const { results: existingRows } = await db
      .prepare(`SELECT id, student_id FROM tutorial_results WHERE course_code = ? AND tutorial_number = ? AND student_id IN (${placeholders})`)
      .bind(code, tutorialNumber, ...studentIds)
      .all();

    const existingMap = new Map(existingRows.map((r: Record<string, unknown>) => [r.student_id as string, r.id as string]));

    // Build batch of all upsert statements
    const statements = [];
    let upserted = 0;
    let modified = 0;

    for (const record of records) {
      const attendedInt = (record.attended ?? true) ? 1 : 0;
      const existingId = existingMap.get(record.studentId);

      if (existingId) {
        statements.push(
          db.prepare("UPDATE tutorial_results SET marks = ?, total_marks = ?, attended = ?, session = ?, updated_at = datetime('now') WHERE id = ?")
            .bind(record.marks, record.totalMarks ?? 10, attendedInt, session, existingId)
        );
        modified++;
      } else {
        statements.push(
          db.prepare('INSERT INTO tutorial_results (id, student_id, course_code, session, tutorial_number, marks, total_marks, attended) VALUES (hex(randomblob(12)), ?, ?, ?, ?, ?, ?, ?)')
            .bind(record.studentId, code, session, tutorialNumber, record.marks, record.totalMarks ?? 10, attendedInt)
        );
        upserted++;
      }
    }

    if (statements.length > 0) {
      await db.batch(statements);
    }

    return NextResponse.json({
      success: true,
      message: 'Tutorial results marked successfully',
      result: { upserted, modified },
    });
  } catch (error: unknown) {
    console.error('Mark tutorial results error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
