import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Course from '@/lib/models/Course';

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

    const sessions: string[] = await Course.distinct('session');

    return NextResponse.json({ success: true, sessions: sessions.sort() });
  } catch (error: unknown) {
    console.error('Get sessions error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
