import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import SemesterResult from '@/lib/models/SemesterResult';

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

    // Students can only access their own semester results
    if (role === 'student' && userId !== studentId) {
      return NextResponse.json(
        { error: 'Forbidden: you can only view your own results' },
        { status: 403 }
      );
    }

    const results = await SemesterResult.find({ studentId }).sort({
      year: 1,
      semester: 1,
      courseCode: 1,
    });

    return NextResponse.json({ success: true, results });
  } catch (error: unknown) {
    console.error('Get student semester results error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
