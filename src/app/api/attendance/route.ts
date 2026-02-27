import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Attendance from '@/lib/models/Attendance';
import { markAttendanceSchema } from '@/lib/validators';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const role = req.headers.get('x-user-role');

    if (!role || !['teacher', 'cr'].includes(role)) {
      return NextResponse.json(
        { error: 'Forbidden: teacher or cr role required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const courseCode = searchParams.get('courseCode');
    const session = searchParams.get('session');
    const date = searchParams.get('date');

    const filter: Record<string, unknown> = {};
    if (courseCode) filter.courseCode = courseCode.toUpperCase();
    if (session) filter.session = session;
    if (date) filter.date = new Date(date);

    const records = await Attendance.find(filter).populate('studentId', '-password');

    return NextResponse.json({ success: true, records });
  } catch (error: unknown) {
    console.error('Get attendance error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const role = req.headers.get('x-user-role');

    if (!role || !['teacher', 'cr'].includes(role)) {
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

    const { courseCode, session, date, records } = parsed.data;
    const markedBy = role as 'teacher' | 'cr';

    const bulkOps = records.map((record) => ({
      updateOne: {
        filter: {
          studentId: record.studentId,
          courseCode: courseCode.toUpperCase(),
          date: new Date(date),
        },
        update: {
          $set: {
            studentId: record.studentId,
            courseCode: courseCode.toUpperCase(),
            session,
            date: new Date(date),
            status: record.status,
            markedBy,
          },
        },
        upsert: true,
      },
    }));

    const result = await Attendance.bulkWrite(bulkOps);

    return NextResponse.json({
      success: true,
      message: 'Attendance marked successfully',
      result: {
        upserted: result.upsertedCount,
        modified: result.modifiedCount,
      },
    });
  } catch (error: unknown) {
    console.error('Mark attendance error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
