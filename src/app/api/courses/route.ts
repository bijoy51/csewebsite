import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Course from '@/lib/models/Course';
import { addCourseSchema } from '@/lib/validators';
import { hashPassword } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const role = req.headers.get('x-user-role');

    if (!role) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const session = searchParams.get('session');

    const filter: Record<string, string> = {};
    if (session) {
      filter.session = session;
    }

    const courses = await Course.find(filter).select('-password');

    return NextResponse.json({ success: true, courses });
  } catch (error: unknown) {
    console.error('Get courses error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const role = req.headers.get('x-user-role');

    if (role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: admin role required' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const parsed = addCourseSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(parsed.data.password);

    const course = await Course.create({
      ...parsed.data,
      password: hashedPassword,
    });

    const courseObj = course.toObject();
    delete courseObj.password;

    return NextResponse.json({ success: true, course: courseObj }, { status: 201 });
  } catch (error: unknown) {
    console.error('Create course error:', error);
    if ((error as { code?: number }).code === 11000) {
      return NextResponse.json(
        { error: 'Course with this code and session already exists' },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
