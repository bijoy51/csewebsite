import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Student from '@/lib/models/Student';
import { hashPassword, signToken } from '@/lib/auth';
import { registerSchema } from '@/lib/validators';
import { COOKIE_NAME } from '@/lib/constants';

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

    await dbConnect();

    const { name, roll, registrationNo, session, email, password } = parsed.data;

    // Check for duplicates
    const existing = await Student.findOne({
      $or: [{ email }, { roll }, { registrationNo }],
    });

    if (existing) {
      let field = 'email';
      if (existing.roll === roll) field = 'roll';
      else if (existing.registrationNo === registrationNo) field = 'registration number';
      return NextResponse.json(
        { error: `A student with this ${field} already exists` },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const student = await Student.create({
      name,
      roll,
      registrationNo,
      session,
      email,
      password: hashedPassword,
    });

    const token = signToken({
      id: student._id.toString(),
      role: 'student',
      session: student.session,
    });

    const response = NextResponse.json(
      {
        success: true,
        user: {
          id: student._id,
          name: student.name,
          email: student.email,
          role: 'student',
          session: student.session,
        },
      },
      { status: 201 }
    );

    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
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
