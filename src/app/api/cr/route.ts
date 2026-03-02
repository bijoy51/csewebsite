import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/d1';
import { addCRSchema } from '@/lib/validators';
import { hashPassword, verifyToken } from '@/lib/auth';
import { COOKIE_NAMES } from '@/lib/constants';

function getAdmin(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAMES.admin)?.value;
  return token ? verifyToken(token) : null;
}

export async function GET(req: NextRequest) {
  try {
    const auth = getAdmin(req);

    if (!auth || auth.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: admin role required' },
        { status: 403 }
      );
    }

    const db = await getDB();
    const { results } = await db
      .prepare('SELECT id AS _id, session, name, roll, created_at AS createdAt, updated_at AS updatedAt FROM crs')
      .all();

    return NextResponse.json({ success: true, crs: results });
  } catch (error: unknown) {
    console.error('Get CRs error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = getAdmin(req);

    if (!auth || auth.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: admin role required' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const parsed = addCRSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const db = await getDB();
    const hashedPassword = await hashPassword(parsed.data.password);

    try {
      const cr = await db
        .prepare(
          'INSERT INTO crs (id, session, name, roll, password) VALUES (hex(randomblob(12)), ?, ?, ?, ?) RETURNING id AS _id, session, name, roll, created_at AS createdAt, updated_at AS updatedAt'
        )
        .bind(parsed.data.session, parsed.data.name, parsed.data.roll, hashedPassword)
        .first();

      return NextResponse.json({ success: true, cr }, { status: 201 });
    } catch (e: unknown) {
      if (String(e).includes('UNIQUE constraint failed')) {
        return NextResponse.json(
          { error: 'CR with this session and roll already exists' },
          { status: 409 }
        );
      }
      throw e;
    }
  } catch (error: unknown) {
    console.error('Create CR error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
