import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Student from '@/lib/models/Student';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const role = req.headers.get('x-user-role');

    if (!role || !['teacher', 'admin', 'cr'].includes(role)) {
      return NextResponse.json(
        { error: 'Forbidden: teacher, admin, or cr role required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const session = searchParams.get('session');

    if (!session) {
      return NextResponse.json(
        { error: 'Query parameter "session" is required' },
        { status: 400 }
      );
    }

    const students = await Student.find({ session })
      .select('-password')
      .sort({ roll: 1 });

    return NextResponse.json({ success: true, students });
  } catch (error: unknown) {
    console.error('Get students error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
