import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/d1';
import { hashPassword, signToken } from '@/lib/auth';
import { registerSchema } from '@/lib/validators';
import { COOKIE_NAMES } from '@/lib/constants';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const db = await getDB();
    const { name, roll, registrationNo, session, email, password } = parsed.data;

    // Check for duplicates
    const existing = await db
      .prepare('SELECT id, email, roll, registration_no FROM students WHERE email = ? OR roll = ? OR registration_no = ?')
      .bind(email, roll, registrationNo)
      .first();

    if (existing) {
      let field = 'email';
      if (existing.roll === roll) field = 'roll';
      else if (existing.registration_no === registrationNo) field = 'registration number';
      return NextResponse.json(
        { error: `A student with this ${field} already exists` },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const result = await db
      .prepare(
        'INSERT INTO students (id, name, roll, registration_no, session, email, password) VALUES (hex(randomblob(12)), ?, ?, ?, ?, ?, ?) RETURNING id, name, email, session'
      )
      .bind(name, roll, registrationNo, session, email, hashedPassword)
      .first();

    if (!result) {
      return NextResponse.json({ error: 'Failed to create student' }, { status: 500 });
    }

    const token = signToken({
      id: result.id as string,
      role: 'student',
      session: result.session as string,
    });

    const response = NextResponse.json(
      {
        success: true,
        user: {
          id: result.id,
          name: result.name,
          email: result.email,
          role: 'student',
          session: result.session,
        },
      },
      { status: 201 }
    );

    response.cookies.set(COOKIE_NAMES.student, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    return response;
  } catch (error: unknown) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
