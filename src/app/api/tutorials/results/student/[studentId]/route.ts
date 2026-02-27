import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import TutorialResult from '@/lib/models/TutorialResult';

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

    // Students can only access their own tutorial results
    if (role === 'student' && userId !== studentId) {
      return NextResponse.json(
        { error: 'Forbidden: you can only view your own tutorial results' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const courseCode = searchParams.get('courseCode');

    const filter: Record<string, unknown> = { studentId };
    if (courseCode) filter.courseCode = courseCode.toUpperCase();

    const results = await TutorialResult.find(filter).sort({
      courseCode: 1,
      tutorialNumber: 1,
    });

    return NextResponse.json({ success: true, results });
  } catch (error: unknown) {
    console.error('Get student tutorial results error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
