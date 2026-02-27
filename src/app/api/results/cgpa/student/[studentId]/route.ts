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

    // Students can only access their own CGPA
    if (role === 'student' && userId !== studentId) {
      return NextResponse.json(
        { error: 'Forbidden: you can only view your own CGPA' },
        { status: 403 }
      );
    }

    const results = await SemesterResult.find({ studentId });

    if (results.length === 0) {
      return NextResponse.json({
        success: true,
        cgpa: 0,
        totalCredits: 0,
        totalCourses: 0,
      });
    }

    // Credit-weighted average of all semester GPAs
    let totalCredits = 0;
    let totalWeightedGpa = 0;

    for (const result of results) {
      totalCredits += result.credits;
      totalWeightedGpa += result.gpa * result.credits;
    }

    const cgpa =
      totalCredits > 0
        ? parseFloat((totalWeightedGpa / totalCredits).toFixed(2))
        : 0;

    return NextResponse.json({
      success: true,
      cgpa,
      totalCredits,
      totalCourses: results.length,
    });
  } catch (error: unknown) {
    console.error('Get CGPA error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
