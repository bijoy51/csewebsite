import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Course from '@/lib/models/Course';
import Student from '@/lib/models/Student';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ courseCode: string }> }
) {
  try {
    await dbConnect();

    const { courseCode } = await params;
    const role = req.headers.get('x-user-role');

    if (!role || !['teacher', 'cr'].includes(role)) {
      return NextResponse.json(
        { error: 'Forbidden: teacher or cr role required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const session = searchParams.get('session');

    // Find the course to get its session
    const courseFilter: Record<string, string> = { courseCode: courseCode.toUpperCase() };
    if (session) {
      courseFilter.session = session;
    }

    const course = await Course.findOne(courseFilter).select('session');

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const students = await Student.find({ session: course.session })
      .select('-password')
      .sort({ roll: 1 });

    return NextResponse.json({ success: true, students });
  } catch (error: unknown) {
    console.error('Get course students error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
