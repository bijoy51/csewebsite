import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { COOKIE_NAME } from '@/lib/constants';
import Student from '@/lib/models/Student';
import Course from '@/lib/models/Course';
import CR from '@/lib/models/CR';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    await dbConnect();

    let user = null;

    switch (payload.role) {
      case 'student': {
        const student = await Student.findById(payload.id).select('-password');
        if (student) {
          user = {
            id: student._id,
            name: student.name,
            email: student.email,
            role: 'student',
            session: student.session,
            roll: student.roll,
            profilePhoto: student.profilePhoto,
          };
        }
        break;
      }
      case 'teacher': {
        const course = await Course.findById(payload.id).select('-password');
        if (course) {
          user = {
            id: course._id,
            name: course.teacherName,
            role: 'teacher',
            courseCode: course.courseCode,
            courseTitle: course.courseTitle,
            session: course.session,
          };
        }
        break;
      }
      case 'admin': {
        user = {
          id: payload.id,
          name: 'Admin',
          role: 'admin',
        };
        break;
      }
      case 'cr': {
        const cr = await CR.findById(payload.id).select('-password');
        if (cr) {
          user = {
            id: cr._id,
            name: cr.name,
            role: 'cr',
            session: cr.session,
            roll: cr.roll,
          };
        }
        break;
      }
    }

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error: unknown) {
    console.error('Auth me error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
