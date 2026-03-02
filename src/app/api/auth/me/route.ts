import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/d1';
import { verifyToken } from '@/lib/auth';
import { COOKIE_NAMES } from '@/lib/constants';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role');

    let token: string | undefined;

    if (role && COOKIE_NAMES[role]) {
      // Check the specific role cookie
      token = req.cookies.get(COOKIE_NAMES[role])?.value;
    } else {
      // Fallback: try all role cookies
      for (const name of Object.values(COOKIE_NAMES)) {
        const t = req.cookies.get(name)?.value;
        if (t) { token = t; break; }
      }
    }

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const db = await getDB();
    let user = null;

    switch (payload.role) {
      case 'student': {
        const student = await db
          .prepare('SELECT id, name, email, session, roll, profile_photo FROM students WHERE id = ?')
          .bind(payload.id)
          .first();
        if (student) {
          user = {
            id: student.id,
            name: student.name,
            email: student.email,
            role: 'student',
            session: student.session,
            roll: student.roll,
            profilePhoto: student.profile_photo,
          };
        }
        break;
      }
      case 'teacher': {
        const course = await db
          .prepare('SELECT id, course_code, course_title, teacher_name, session FROM courses WHERE id = ?')
          .bind(payload.id)
          .first();
        if (course) {
          user = {
            id: course.id,
            name: course.teacher_name,
            role: 'teacher',
            courseCode: course.course_code,
            courseTitle: course.course_title,
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
        const cr = await db
          .prepare('SELECT id, name, session, roll FROM crs WHERE id = ?')
          .bind(payload.id)
          .first();
        if (cr) {
          user = {
            id: cr.id,
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
