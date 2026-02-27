import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import TutorialResult from '@/lib/models/TutorialResult';
import { markTutorialResultsSchema } from '@/lib/validators';

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

    const filter: Record<string, string> = {};
    if (courseCode) filter.courseCode = courseCode.toUpperCase();
    if (session) filter.session = session;

    const results = await TutorialResult.find(filter)
      .populate('studentId', '-password')
      .sort({ tutorialNumber: 1 });

    return NextResponse.json({ success: true, results });
  } catch (error: unknown) {
    console.error('Get tutorial results error:', error);
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
    const parsed = markTutorialResultsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { courseCode, session, tutorialNumber, records } = parsed.data;

    const bulkOps = records.map((record) => ({
      updateOne: {
        filter: {
          studentId: record.studentId,
          courseCode: courseCode.toUpperCase(),
          tutorialNumber,
        },
        update: {
          $set: {
            studentId: record.studentId,
            courseCode: courseCode.toUpperCase(),
            session,
            tutorialNumber,
            marks: record.marks,
            totalMarks: record.totalMarks ?? 10,
            attended: record.attended ?? true,
          },
        },
        upsert: true,
      },
    }));

    const result = await TutorialResult.bulkWrite(bulkOps);

    return NextResponse.json({
      success: true,
      message: 'Tutorial results marked successfully',
      result: {
        upserted: result.upsertedCount,
        modified: result.modifiedCount,
      },
    });
  } catch (error: unknown) {
    console.error('Mark tutorial results error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
