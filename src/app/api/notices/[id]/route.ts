import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/d1';
import { getAuthUser } from '@/lib/auth';
import { updateNoticeSchema } from '@/lib/validators';

// PUT — admin only
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const auth = getAuthUser(req);
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: admin role required' }, { status: 403 });
    }

    const body = await req.json();
    const parsed = updateNoticeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { type, title, content, image_url, category, date } = parsed.data;

    const db = await getDB();
    const result = await db
      .prepare(
        `UPDATE notices SET
          type = COALESCE(?, type),
          title = COALESCE(?, title),
          content = COALESCE(?, content),
          image_url = COALESCE(?, image_url),
          category = COALESCE(?, category),
          date = COALESCE(?, date),
          updated_at = datetime('now')
        WHERE id = ?`
      )
      .bind(type ?? null, title ?? null, content ?? null, image_url ?? null, category ?? null, date ?? null, id)
      .run();

    if (!result.meta.changes) {
      return NextResponse.json({ error: 'Notice not found' }, { status: 404 });
    }

    const updated = await db
      .prepare('SELECT id AS _id, type, title, content, image_url AS imageUrl, category, date, created_at AS createdAt FROM notices WHERE id = ?')
      .bind(id)
      .first();

    return NextResponse.json({ success: true, notice: updated });
  } catch (error: unknown) {
    console.error('Update notice error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE — admin only
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const auth = getAuthUser(req);
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: admin role required' }, { status: 403 });
    }

    const db = await getDB();
    const result = await db
      .prepare('DELETE FROM notices WHERE id = ?')
      .bind(id)
      .run();

    if (!result.meta.changes) {
      return NextResponse.json({ error: 'Notice not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Notice deleted successfully' });
  } catch (error: unknown) {
    console.error('Delete notice error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
