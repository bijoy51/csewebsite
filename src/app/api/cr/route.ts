import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import CR from '@/lib/models/CR';
import { addCRSchema } from '@/lib/validators';
import { hashPassword } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const role = req.headers.get('x-user-role');

    if (role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: admin role required' },
        { status: 403 }
      );
    }

    const crs = await CR.find().select('-password');

    return NextResponse.json({ success: true, crs });
  } catch (error: unknown) {
    console.error('Get CRs error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const role = req.headers.get('x-user-role');

    if (role !== 'admin') {
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

    const hashedPassword = await hashPassword(parsed.data.password);

    const cr = await CR.create({
      ...parsed.data,
      password: hashedPassword,
    });

    const crObj = cr.toObject();
    delete crObj.password;

    return NextResponse.json({ success: true, cr: crObj }, { status: 201 });
  } catch (error: unknown) {
    console.error('Create CR error:', error);
    if ((error as { code?: number }).code === 11000) {
      return NextResponse.json(
        { error: 'CR with this session and roll already exists' },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
