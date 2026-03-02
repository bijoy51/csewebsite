import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/d1';
import { verifyToken } from '@/lib/auth';
import { COOKIE_NAMES } from '@/lib/constants';

export async function GET(req: NextRequest) {
  try {
    // Directly check admin cookie to avoid any path-detection issues
    const token = req.cookies.get(COOKIE_NAMES.admin)?.value;
    const auth = token ? verifyToken(token) : null;

    if (!auth || auth.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: admin role required' },
        { status: 403 }
      );
    }

    const db = await getDB();

    // 4 queries total instead of 3N+4
    const [sessionRows, studentCounts, courseCounts, crCounts] = await db.batch([
      db.prepare('SELECT DISTINCT session FROM courses ORDER BY session'),
      db.prepare('SELECT session, COUNT(*) AS count FROM students GROUP BY session'),
      db.prepare('SELECT session, COUNT(*) AS count FROM courses GROUP BY session'),
      db.prepare('SELECT session, COUNT(*) AS count FROM crs GROUP BY session'),
    ]);

    const sessions = sessionRows.results.map((r: Record<string, unknown>) => r.session as string);

    // Build lookup maps from GROUP BY results
    const studentMap = new Map<string, number>(studentCounts.results.map((r: Record<string, unknown>) => [r.session as string, Number(r.count)]));
    const courseMap = new Map<string, number>(courseCounts.results.map((r: Record<string, unknown>) => [r.session as string, Number(r.count)]));
    const crMap = new Map<string, number>(crCounts.results.map((r: Record<string, unknown>) => [r.session as string, Number(r.count)]));

    let totalStudents = 0, totalCourses = 0, totalCRs = 0;

    const sessionSummaries = sessions.map((session: string) => {
      const sc = studentMap.get(session) ?? 0;
      const cc = courseMap.get(session) ?? 0;
      const crc = crMap.get(session) ?? 0;
      totalStudents += sc;
      totalCourses += cc;
      totalCRs += crc;
      return { session, studentCount: sc, courseCount: cc, crCount: crc };
    });

    return NextResponse.json({
      success: true,
      totalStudents,
      totalCourses,
      totalCRs,
      sessions: sessionSummaries,
    });
  } catch (error: unknown) {
    console.error('Admin summary error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
