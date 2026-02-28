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
        { error: 'Forbidden: you can only view your own CGPA' },
        { status: 403 }
      );
    }

    const db = await getDB();

    const { results } = await db
      .prepare('SELECT gpa, credits FROM semester_results WHERE student_id = ?')
      .bind(studentId)
      .all();

    if (results.length === 0) {
      return NextResponse.json({
        success: true,
        cgpa: 0,
        totalCredits: 0,
        totalCourses: 0,
      });
    }

    let totalCredits = 0;
    let totalWeightedGpa = 0;

    for (const result of results) {
      totalCredits += result.credits as number;
      totalWeightedGpa += (result.gpa as number) * (result.credits as number);
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
