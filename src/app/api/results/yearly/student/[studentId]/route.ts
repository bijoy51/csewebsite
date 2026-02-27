import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import SemesterResult from '@/lib/models/SemesterResult';

interface SemesterGroup {
  semester: number;
  totalCredits: number;
  weightedGpa: number;
  courses: Array<{
    courseCode: string;
    grade: string;
    gpa: number;
    credits: number;
  }>;
}

interface YearGroup {
  year: number;
  semesters: Record<number, SemesterGroup>;
}

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

    // Students can only access their own results
    if (role === 'student' && userId !== studentId) {
      return NextResponse.json(
        { error: 'Forbidden: you can only view your own results' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const yearParam = searchParams.get('year');

    const filter: Record<string, unknown> = { studentId };
    if (yearParam) filter.year = parseInt(yearParam);

    const results = await SemesterResult.find(filter).sort({
      year: 1,
      semester: 1,
    });

    // Group by year
    const yearMap: Record<number, YearGroup> = {};

    for (const result of results) {
      const y = result.year;
      const s = result.semester;

      if (!yearMap[y]) {
        yearMap[y] = { year: y, semesters: {} };
      }

      if (!yearMap[y].semesters[s]) {
        yearMap[y].semesters[s] = {
          semester: s,
          totalCredits: 0,
          weightedGpa: 0,
          courses: [],
        };
      }

      yearMap[y].semesters[s].totalCredits += result.credits;
      yearMap[y].semesters[s].weightedGpa += result.gpa * result.credits;
      yearMap[y].semesters[s].courses.push({
        courseCode: result.courseCode,
        grade: result.grade,
        gpa: result.gpa,
        credits: result.credits,
      });
    }

    // Compute yearly averages weighted by credits
    const yearlyResults = Object.values(yearMap).map((yearGroup) => {
      const semesterResults = Object.values(yearGroup.semesters).map((sem) => ({
        semester: sem.semester,
        gpa:
          sem.totalCredits > 0
            ? parseFloat((sem.weightedGpa / sem.totalCredits).toFixed(2))
            : 0,
        totalCredits: sem.totalCredits,
        courses: sem.courses,
      }));

      // Yearly average: weighted average of both semesters by credits
      let totalCredits = 0;
      let totalWeightedGpa = 0;

      for (const sem of Object.values(yearGroup.semesters)) {
        totalCredits += sem.totalCredits;
        totalWeightedGpa += sem.weightedGpa;
      }

      const yearlyGpa =
        totalCredits > 0
          ? parseFloat((totalWeightedGpa / totalCredits).toFixed(2))
          : 0;

      return {
        year: yearGroup.year,
        yearlyGpa,
        totalCredits,
        semesters: semesterResults,
      };
    });

    return NextResponse.json({ success: true, yearlyResults });
  } catch (error: unknown) {
    console.error('Get yearly results error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
