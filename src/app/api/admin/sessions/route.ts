import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/d1';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthUser(req);

    if (auth?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: admin role required' },
        { status: 403 }
      );
    }

    const db = await getDB();
    const { results } = await db
      .prepare('SELECT session FROM sessions ORDER BY session')
      .all();

    const sessions = results.map((r: Record<string, unknown>) => r.session as string);

    return NextResponse.json({ success: true, sessions });
  } catch (error: unknown) {
    console.error('Get sessions error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthUser(req);

    if (auth?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: admin role required' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { session } = body;

    if (!session || typeof session !== 'string' || !session.trim()) {
      return NextResponse.json(
        { error: 'Session name is required' },
        { status: 400 }
      );
    }

    const db = await getDB();

    const existing = await db
      .prepare('SELECT id FROM sessions WHERE session = ?')
      .bind(session.trim())
      .first();

    if (existing) {
      return NextResponse.json(
        { error: 'Session already exists' },
        { status: 409 }
      );
    }

    await db
      .prepare('INSERT INTO sessions (id, session) VALUES (hex(randomblob(12)), ?)')
      .bind(session.trim())
      .run();

    return NextResponse.json({ success: true, message: 'Session created' }, { status: 201 });
  } catch (error: unknown) {
    console.error('Create session error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = getAuthUser(req);

    if (auth?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: admin role required' },
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

    const studentCount = await db
      .prepare('SELECT COUNT(*) AS count FROM students WHERE session = ?')
      .bind(session)
      .first();

    if ((studentCount?.count as number) > 0) {
      return NextResponse.json(
        { error: 'Cannot delete session with existing students' },
        { status: 400 }
      );
    }

    await db
      .prepare('DELETE FROM sessions WHERE session = ?')
      .bind(session)
      .run();

    return NextResponse.json({ success: true, message: 'Session deleted' });
  } catch (error: unknown) {
    console.error('Delete session error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
