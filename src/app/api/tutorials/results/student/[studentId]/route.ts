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
        { error: 'Forbidden: you can only view your own tutorial results' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const courseCode = searchParams.get('courseCode');

    const db = await getDB();

    const conditions = ['student_id = ?'];
    const bindings: unknown[] = [studentId];
    if (courseCode) {
      conditions.push('course_code = ?');
      bindings.push(courseCode.toUpperCase());
    }

    const { results } = await db
      .prepare(
        'SELECT id AS _id, student_id AS studentId, course_code AS courseCode, session, tutorial_number AS tutorialNumber, marks, total_marks AS totalMarks, attended, created_at AS createdAt, updated_at AS updatedAt FROM tutorial_results WHERE ' + conditions.join(' AND ') + ' ORDER BY course_code ASC, tutorial_number ASC'
      )
      .bind(...bindings)
      .all();

    const mapped = results.map((r: Record<string, unknown>) => ({ ...r, attended: Boolean(r.attended) }));

    return NextResponse.json({ success: true, results: mapped });
  } catch (error: unknown) {
    console.error('Get student tutorial results error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
