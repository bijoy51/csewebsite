import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Student from '@/lib/models/Student';
import { updateProfileSchema } from '@/lib/validators';

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

    // Students can only access their own profile; teacher/admin can access any
    if (role === 'student' && userId !== studentId) {
      return NextResponse.json(
        { error: 'Forbidden: you can only view your own profile' },
        { status: 403 }
      );
    }

    const student = await Student.findById(studentId).select('-password');

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, student });
  } catch (error: unknown) {
    console.error('Get student error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
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

    // Students can only update their own profile
    if (role === 'student' && userId !== studentId) {
      return NextResponse.json(
        { error: 'Forbidden: you can only update your own profile' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const parsed = updateProfileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const student = await Student.findByIdAndUpdate(
      studentId,
      { $set: parsed.data },
      { new: true }
    ).select('-password');

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, student });
  } catch (error: unknown) {
    console.error('Update student error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
