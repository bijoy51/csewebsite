import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import SemesterResult from '@/lib/models/SemesterResult';
import { markSemesterResultsSchema } from '@/lib/validators';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const role = req.headers.get('x-user-role');

    if (role !== 'teacher') {
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

    const filter: Record<string, unknown> = {};
    if (courseCode) filter.courseCode = courseCode.toUpperCase();
    if (session) filter.session = session;
    if (year) filter.year = parseInt(year);
    if (semester) filter.semester = parseInt(semester);

    const results = await SemesterResult.find(filter).populate(
      'studentId',
      '-password'
    );

    return NextResponse.json({ success: true, results });
  } catch (error: unknown) {
    console.error('Get semester results error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const role = req.headers.get('x-user-role');

    if (role !== 'teacher') {
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

    const { courseCode, session, year, semester, records } = parsed.data;

    const bulkOps = records.map((record) => ({
      updateOne: {
        filter: {
          studentId: record.studentId,
          courseCode: courseCode.toUpperCase(),
          year,
          semester,
        },
        update: {
          $set: {
            studentId: record.studentId,
            courseCode: courseCode.toUpperCase(),
            session,
            year,
            semester,
            grade: record.grade,
            gpa: record.gpa,
            credits: record.credits ?? 3,
          },
        },
        upsert: true,
      },
    }));

    const result = await SemesterResult.bulkWrite(bulkOps);

    return NextResponse.json({
      success: true,
      message: 'Semester results entered successfully',
      result: {
        upserted: result.upsertedCount,
        modified: result.modifiedCount,
      },
    });
  } catch (error: unknown) {
    console.error('Mark semester results error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
