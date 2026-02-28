import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/d1';
import { markSemesterResultsSchema } from '@/lib/validators';
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
    const year = searchParams.get('year');
    const semester = searchParams.get('semester');

    const db = await getDB();

    const conditions: string[] = [];
    const bindings: unknown[] = [];
    if (courseCode) { conditions.push('sr.course_code = ?'); bindings.push(courseCode.toUpperCase()); }
    if (session) { conditions.push('sr.session = ?'); bindings.push(session); }
    if (year) { conditions.push('sr.year = ?'); bindings.push(parseInt(year)); }
    if (semester) { conditions.push('sr.semester = ?'); bindings.push(parseInt(semester)); }

    const where = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

    const { results } = await db
      .prepare(
        'SELECT sr.id AS _id, sr.course_code AS courseCode, sr.session, sr.year, sr.semester, sr.grade, sr.gpa, sr.credits, ' +
        "json_object('_id', s.id, 'name', s.name, 'roll', s.roll, 'registrationNo', s.registration_no, 'session', s.session, 'email', s.email) AS studentId " +
        'FROM semester_results sr LEFT JOIN students s ON sr.student_id = s.id ' + where
      )
      .bind(...bindings)
      .all();

    const parsedResults = results.map((r: Record<string, unknown>) => ({
      ...r,
      studentId: typeof r.studentId === 'string' ? JSON.parse(r.studentId as string) : r.studentId,
    }));

    return NextResponse.json({ success: true, results: parsedResults });
  } catch (error: unknown) {
    console.error('Get semester results error:', error);
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
    const parsed = markSemesterResultsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const db = await getDB();
    const { courseCode, session, records } = parsed.data;
    const code = courseCode.toUpperCase();

    // Derive year/semester from course code digits (e.g. CSE 2102 → year=2, semester=1)
    const digits = code.replace(/[^0-9]/g, '');
    const year = digits.length >= 2 ? (parseInt(digits[0]) || 1) : 1;
    const semester = digits.length >= 2 ? (parseInt(digits[1]) || 1) : 1;

    // Batch-fetch all existing records in one query
    const studentIds = records.map((r) => r.studentId);
    const placeholders = studentIds.map(() => '?').join(',');
    const { results: existingRows } = await db
      .prepare(`SELECT id, student_id FROM semester_results WHERE course_code = ? AND year = ? AND semester = ? AND student_id IN (${placeholders})`)
      .bind(code, year, semester, ...studentIds)
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
          db.prepare("UPDATE semester_results SET grade = ?, gpa = ?, credits = ?, session = ?, updated_at = datetime('now') WHERE id = ?")
            .bind(record.grade, record.gpa, record.credits ?? 3, session, existingId)
        );
        modified++;
      } else {
        statements.push(
          db.prepare('INSERT INTO semester_results (id, student_id, course_code, session, year, semester, grade, gpa, credits) VALUES (hex(randomblob(12)), ?, ?, ?, ?, ?, ?, ?, ?)')
            .bind(record.studentId, code, session, year, semester, record.grade, record.gpa, record.credits ?? 3)
        );
        upserted++;
      }
    }

    if (statements.length > 0) {
      await db.batch(statements);
    }

    return NextResponse.json({
      success: true,
      message: 'Semester results entered successfully',
      result: { upserted, modified },
    });
  } catch (error: unknown) {
    console.error('Mark semester results error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
