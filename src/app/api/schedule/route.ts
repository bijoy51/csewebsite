import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import ClassSchedule from '@/lib/models/ClassSchedule';
import { createScheduleSchema } from '@/lib/validators';

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
    if (session) filter.session = session;

    const schedules = await ClassSchedule.find(filter).sort({ date: -1 });

    return NextResponse.json({ success: true, schedules });
  } catch (error: unknown) {
    console.error('Get schedule error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const role = req.headers.get('x-user-role');

    if (!role || !['teacher', 'admin'].includes(role)) {
      return NextResponse.json(
        { error: 'Forbidden: teacher or admin role required' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const parsed = createScheduleSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const schedule = await ClassSchedule.create({
      courseCode: parsed.data.courseCode,
      session: parsed.data.session,
      date: new Date(parsed.data.date),
      time: parsed.data.time,
      room: parsed.data.room ?? '',
    });

    return NextResponse.json({ success: true, schedule }, { status: 201 });
  } catch (error: unknown) {
    console.error('Create schedule error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
