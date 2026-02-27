import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Tutorial from '@/lib/models/Tutorial';
import { createTutorialSchema } from '@/lib/validators';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const role = req.headers.get('x-user-role');

    if (!role) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const courseCode = searchParams.get('courseCode');
    const session = searchParams.get('session');

    const filter: Record<string, string> = {};
    if (courseCode) filter.courseCode = courseCode.toUpperCase();
    if (session) filter.session = session;

    const tutorials = await Tutorial.find(filter).sort({ tutorialNumber: 1 });

    return NextResponse.json({ success: true, tutorials });
  } catch (error: unknown) {
    console.error('Get tutorials error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const role = req.headers.get('x-user-role');

    if (role !== 'teacher') {
      return NextResponse.json(
        { error: 'Forbidden: teacher role required' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const parsed = createTutorialSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const tutorialData: Record<string, unknown> = {
      courseCode: parsed.data.courseCode,
      session: parsed.data.session,
      tutorialNumber: parsed.data.tutorialNumber,
      topic: parsed.data.topic,
    };

    if (parsed.data.date) {
      tutorialData.date = new Date(parsed.data.date);
    }

    const tutorial = await Tutorial.create(tutorialData);

    return NextResponse.json({ success: true, tutorial }, { status: 201 });
  } catch (error: unknown) {
    console.error('Create tutorial error:', error);
    if ((error as { code?: number }).code === 11000) {
      return NextResponse.json(
        { error: 'Tutorial with this number already exists for this course and session' },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
