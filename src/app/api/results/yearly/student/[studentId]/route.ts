import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/d1';
import { getAuthUser } from '@/lib/auth';

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
    const { studentId } = await params;
    const auth = getAuthUser(req);

    if (!auth) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    if (auth.role === 'student' && auth.id !== studentId) {
      return NextResponse.json(
        { error: 'Forbidden: you can only view your own results' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const yearParam = searchParams.get('year');

    const db = await getDB();

    const { results } = await db
      .prepare(
        'SELECT course_code, grade, gpa, credits FROM semester_results WHERE student_id = ? ORDER BY course_code ASC'
      )
      .bind(studentId)
      .all();

    const yearMap: Record<number, YearGroup> = {};

    for (const result of results) {
      // Derive year/semester from course code digits (e.g. CSE 2102 → year=2, semester=1)
      const code = (result.course_code as string) || '';
      const digits = code.replace(/[^0-9]/g, '');
      const y = digits.length >= 2 ? (parseInt(digits[0]) || 1) : 1;
      const s = digits.length >= 2 ? (parseInt(digits[1]) || 1) : 1;

      // Filter by year if requested
      if (yearParam && y !== parseInt(yearParam)) continue;

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

      yearMap[y].semesters[s].totalCredits += result.credits as number;
      yearMap[y].semesters[s].weightedGpa += (result.gpa as number) * (result.credits as number);
      yearMap[y].semesters[s].courses.push({
        courseCode: result.course_code as string,
        grade: result.grade as string,
        gpa: result.gpa as number,
        credits: result.credits as number,
      });
    }

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
