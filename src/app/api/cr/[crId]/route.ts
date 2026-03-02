import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/d1';
import { verifyToken } from '@/lib/auth';
import { COOKIE_NAMES } from '@/lib/constants';

function getAdmin(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAMES.admin)?.value;
  return token ? verifyToken(token) : null;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ crId: string }> }
) {
  try {
    const { crId } = await params;
    const auth = getAdmin(req);

    if (!auth || auth.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: admin role required' },
        { status: 403 }
      );
    }

    const db = await getDB();
    const cr = await db
      .prepare('SELECT id AS _id, session, name, roll, created_at AS createdAt, updated_at AS updatedAt FROM crs WHERE id = ?')
      .bind(crId)
      .first();

    if (!cr) {
      return NextResponse.json({ error: 'CR not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, cr });
  } catch (error: unknown) {
    console.error('Get CR error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ crId: string }> }
) {
  try {
    const { crId } = await params;
    const auth = getAdmin(req);

    if (!auth || auth.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: admin role required' },
        { status: 403 }
      );
    }

    const db = await getDB();
    const result = await db
      .prepare('DELETE FROM crs WHERE id = ?')
      .bind(crId)
      .run();

    if (!result.meta.changes) {
      return NextResponse.json({ error: 'CR not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'CR deleted successfully' });
  } catch (error: unknown) {
    console.error('Delete CR error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
