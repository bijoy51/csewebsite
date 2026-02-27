import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Course from '@/lib/models/Course';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ courseCode: string }> }
) {
  try {
    await dbConnect();

    const { courseCode } = await params;
    const role = req.headers.get('x-user-role');

    if (!role) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const session = searchParams.get('session');

    const filter: Record<string, string> = { courseCode: courseCode.toUpperCase() };
    if (session) {
      filter.session = session;
    }

    const course = await Course.findOne(filter).select('-password');

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, course });
  } catch (error: unknown) {
    console.error('Get course error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ courseCode: string }> }
) {
  try {
    await dbConnect();

    const { courseCode } = await params;
    const role = req.headers.get('x-user-role');

    if (role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: admin role required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const session = searchParams.get('session');

    const filter: Record<string, string> = { courseCode: courseCode.toUpperCase() };
    if (session) {
      filter.session = session;
    }

    const course = await Course.findOneAndDelete(filter);

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Course deleted successfully' });
  } catch (error: unknown) {
    console.error('Delete course error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
