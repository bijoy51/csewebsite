import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/d1';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q')?.toUpperCase() || '';

    const db = await getDB();

    let results;
    if (q) {
      ({ results } = await db
        .prepare(
          'SELECT course_code AS courseCode, course_title AS courseTitle, credit, year, semester, is_optional AS isOptional FROM curriculum WHERE UPPER(course_code) LIKE ? ORDER BY course_code LIMIT 20'
        )
        .bind(`%${q}%`)
        .all());
    } else {
      ({ results } = await db
        .prepare(
          'SELECT course_code AS courseCode, course_title AS courseTitle, credit, year, semester, is_optional AS isOptional FROM curriculum ORDER BY course_code'
        )
        .all());
    }

    return NextResponse.json({ success: true, courses: results });
  } catch (error: unknown) {
    console.error('Get curriculum error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
