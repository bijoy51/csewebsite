import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/d1';
import { getAuthUser } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ studentId: string }> }
) {
  try {
    const { studentId } = await params;
    const auth = getAuthUser(req);

    if (!auth) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    if (auth.role === 'student' && auth.id !== studentId) {
      return NextResponse.json(
        { error: 'Forbidden: you can only view your own results' },
        { status: 403 }
      );
    }

    const db = await getDB();

    const { results: rawResults } = await db
      .prepare(
        'SELECT id AS _id, student_id AS studentId, course_code AS courseCode, session, grade, gpa, credits, created_at AS createdAt, updated_at AS updatedAt FROM semester_results WHERE student_id = ? ORDER BY course_code ASC'
      )
      .bind(studentId)
      .all();

    // Derive year/semester from course code digits (e.g. CSE 2102 → year=2, semester=1)
    const results = rawResults.map((r: Record<string, unknown>) => {
      const code = (r.courseCode as string) || '';
      const digits = code.replace(/[^0-9]/g, '');
      const year = digits.length >= 2 ? (parseInt(digits[0]) || 1) : 1;
      const semester = digits.length >= 2 ? (parseInt(digits[1]) || 1) : 1;
      return { ...r, year, semester };
    });

    // Sort by year, semester, courseCode
    results.sort((a: Record<string, unknown>, b: Record<string, unknown>) => {
      if ((a.year as number) !== (b.year as number)) return (a.year as number) - (b.year as number);
      if ((a.semester as number) !== (b.semester as number)) return (a.semester as number) - (b.semester as number);
      return ((a.courseCode as string) || '').localeCompare((b.courseCode as string) || '');
    });

    return NextResponse.json({ success: true, results });
  } catch (error: unknown) {
    console.error('Get student semester results error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
