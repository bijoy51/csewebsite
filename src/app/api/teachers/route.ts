import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/d1';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthUser(req);

    if (!auth) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const db = await getDB();
    const { results } = await db
      .prepare('SELECT id AS _id, name, designation FROM teachers ORDER BY designation, name')
      .all();

    return NextResponse.json({ success: true, teachers: results });
  } catch (error: unknown) {
    console.error('Get teachers error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
