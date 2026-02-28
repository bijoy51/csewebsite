import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/d1';
import { updateProfileSchema } from '@/lib/validators';
import { getAuthUser } from '@/lib/auth';

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
        { error: 'Forbidden: you can only view your own profile' },
        { status: 403 }
      );
    }

    const db = await getDB();
    const student = await db
      .prepare(
        'SELECT id AS _id, name, roll, registration_no AS registrationNo, session, email, profile_photo AS profilePhoto, phone, blood_group AS bloodGroup, address, created_at AS createdAt, updated_at AS updatedAt FROM students WHERE id = ?'
      )
      .bind(studentId)
      .first();

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
    const { studentId } = await params;
    const auth = getAuthUser(req);

    if (!auth) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    if (auth.role === 'student' && auth.id !== studentId) {
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

    const db = await getDB();
    const data = parsed.data;

    const setClauses: string[] = [];
    const values: unknown[] = [];

    if (data.profilePhoto !== undefined) { setClauses.push('profile_photo = ?'); values.push(data.profilePhoto); }
    if (data.phone !== undefined) { setClauses.push('phone = ?'); values.push(data.phone); }
    if (data.bloodGroup !== undefined) { setClauses.push('blood_group = ?'); values.push(data.bloodGroup); }
    if (data.address !== undefined) { setClauses.push('address = ?'); values.push(data.address); }

    if (setClauses.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    setClauses.push("updated_at = datetime('now')");
    values.push(studentId);

    await db
      .prepare(`UPDATE students SET ${setClauses.join(', ')} WHERE id = ?`)
      .bind(...values)
      .run();

    const student = await db
      .prepare(
        'SELECT id AS _id, name, roll, registration_no AS registrationNo, session, email, profile_photo AS profilePhoto, phone, blood_group AS bloodGroup, address, created_at AS createdAt, updated_at AS updatedAt FROM students WHERE id = ?'
      )
      .bind(studentId)
      .first();

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, student });
  } catch (error: unknown) {
    console.error('Update student error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
