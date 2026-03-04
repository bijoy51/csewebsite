import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/d1';
import { getAuthUser } from '@/lib/auth';
import { createNoticeSchema } from '@/lib/validators';

// GET — public, no auth required
export async function GET() {
  try {
    const db = await getDB();
    const { results } = await db
      .prepare(
        'SELECT id AS _id, type, title, content, image_url AS imageUrl, category, date, created_at AS createdAt FROM notices ORDER BY date DESC, created_at DESC'
      )
      .all();

    return NextResponse.json({ success: true, notices: results });
  } catch (error: unknown) {
    console.error('Get notices error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST — admin only
export async function POST(req: NextRequest) {
  try {
    const auth = getAuthUser(req);
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: admin role required' }, { status: 403 });
    }

    const body = await req.json();
    const parsed = createNoticeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { type, title, content, image_url, category, date } = parsed.data;
    const noticeDate = date || new Date().toISOString().split('T')[0];

    const db = await getDB();
    const notice = await db
      .prepare(
        'INSERT INTO notices (type, title, content, image_url, category, date) VALUES (?, ?, ?, ?, ?, ?) RETURNING id AS _id, type, title, content, image_url AS imageUrl, category, date, created_at AS createdAt'
      )
      .bind(type, title, content || '', image_url || '', category || '', noticeDate)
      .first();

    return NextResponse.json({ success: true, notice }, { status: 201 });
  } catch (error: unknown) {
    console.error('Create notice error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
