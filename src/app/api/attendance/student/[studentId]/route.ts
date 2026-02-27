import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Attendance from '@/lib/models/Attendance';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ studentId: string }> }
) {
  try {
    await dbConnect();

    const { studentId } = await params;
    const userId = req.headers.get('x-user-id');
    const role = req.headers.get('x-user-role');

    if (!userId || !role) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Students can only access their own attendance; teacher can access any
    if (role === 'student' && userId !== studentId) {
      return NextResponse.json(
        { error: 'Forbidden: you can only view your own attendance' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const courseCode = searchParams.get('courseCode');

    const filter: Record<string, unknown> = { studentId };
    if (courseCode) filter.courseCode = courseCode.toUpperCase();

    const records = await Attendance.find(filter);

    // Group by courseCode and compute summary
    const courseMap: Record<
      string,
      { courseCode: string; total: number; attended: number; missed: number }
    > = {};

    for (const record of records) {
      const code = record.courseCode;
      if (!courseMap[code]) {
        courseMap[code] = { courseCode: code, total: 0, attended: 0, missed: 0 };
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
