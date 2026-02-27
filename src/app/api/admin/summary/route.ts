import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Student from '@/lib/models/Student';
import Course from '@/lib/models/Course';
import CR from '@/lib/models/CR';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const role = req.headers.get('x-user-role');

    if (role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: admin role required' },
        { status: 403 }
      );
    }

    // Get distinct sessions from courses
    const sessions: string[] = await Course.distinct('session');

    // Build summary per session
    const sessionSummaries = await Promise.all(
      sessions.map(async (session) => {
        const [studentCount, courseCount, crCount] = await Promise.all([
          Student.countDocuments({ session }),
          Course.countDocuments({ session }),
          CR.countDocuments({ session }),
        ]);

        return {
          session,
          students: studentCount,
          courses: courseCount,
          crs: crCount,
        };
      })
    );

    // Overall counts
    const [totalStudents, totalCourses, totalCRs] = await Promise.all([
      Student.countDocuments(),
      Course.countDocuments(),
      CR.countDocuments(),
    ]);

    return NextResponse.json({
      success: true,
      summary: {
        total: {
          students: totalStudents,
          courses: totalCourses,
          crs: totalCRs,
        },
        sessions: sessionSummaries,
      },
    });
  } catch (error: unknown) {
    console.error('Admin summary error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
