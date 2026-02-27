import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Admin from '@/lib/models/Admin';
import { comparePassword, signToken, hashPassword } from '@/lib/auth';
import { adminLoginSchema } from '@/lib/validators';
import { COOKIE_NAME } from '@/lib/constants';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = adminLoginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    await dbConnect();

    const { password } = parsed.data;

    // Find admin or create default one
    let admin = await Admin.findOne();
    if (!admin) {
      const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'admin123';
      const hashed = await hashPassword(defaultPassword);
      admin = await Admin.create({ password: hashed });
    }

    if (!(await comparePassword(password, admin.password))) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    const token = signToken({
      id: admin._id.toString(),
      role: 'admin',
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: admin._id,
        name: 'Admin',
        role: 'admin',
      },
    });

    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    return response;
  } catch (error: unknown) {
    console.error('Admin login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
