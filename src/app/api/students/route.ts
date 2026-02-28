import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/d1';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthUser(req);

    if (!auth || !['teacher', 'admin', 'cr'].includes(auth.role)) {
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

    const db = await getDB();
    const { results } = await db
      .prepare(
        'SELECT id AS _id, name, roll, registration_no AS registrationNo, session, email, profile_photo AS profilePhoto, phone, blood_group AS bloodGroup, address, created_at AS createdAt, updated_at AS updatedAt FROM students WHERE session = ? ORDER BY roll ASC'
      )
      .bind(session)
      .all();

    return NextResponse.json({ success: true, students: results });
  } catch (error: unknown) {
    console.error('Get students error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
