import { NextResponse } from 'next/server';
import { getDB } from '@/lib/d1';

export async function GET() {
  try {
    const db = await getDB();
    const { results } = await db
      .prepare('SELECT session FROM sessions ORDER BY session')
      .all();

    const sessions = results.map((r: Record<string, unknown>) => r.session as string);

    return NextResponse.json({ success: true, sessions });
  } catch (error: unknown) {
    console.error('Get public sessions error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
