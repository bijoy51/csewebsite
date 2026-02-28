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
        { error: 'Forbidden: you can only view your own attendance' },
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
      .prepare('SELECT a.course_code, a.status, c.course_title FROM attendance a LEFT JOIN courses c ON a.course_code = c.course_code AND a.session = c.session WHERE ' + conditions.map(c => c.replace('student_id', 'a.student_id').replace('course_code', 'a.course_code')).join(' AND '))
      .bind(...bindings)
      .all();

    const courseMap: Record<string, { courseCode: string; courseTitle: string; total: number; attended: number; missed: number }> = {};

    for (const record of results) {
      const code = record.course_code as string;
      if (!courseMap[code]) {
        courseMap[code] = { courseCode: code, courseTitle: (record.course_title as string) || '', total: 0, attended: 0, missed: 0 };
      }
      courseMap[code].total += 1;
      if (record.status === 'present') {
        courseMap[code].attended += 1;
      } else {
        courseMap[code].missed += 1;
      }
    }

    const summary = Object.values(courseMap).map((course) => ({
      ...course,
      percentage:
        course.total > 0
          ? parseFloat(((course.attended / course.total) * 100).toFixed(2))
          : 0,
    }));

    return NextResponse.json({ success: true, summary });
  } catch (error: unknown) {
    console.error('Get attendance summary error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
