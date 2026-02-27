import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import CR from '@/lib/models/CR';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ crId: string }> }
) {
  try {
    await dbConnect();

    const { crId } = await params;
    const role = req.headers.get('x-user-role');

    if (role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: admin role required' },
        { status: 403 }
      );
    }

    const cr = await CR.findById(crId).select('-password');

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
    await dbConnect();

    const { crId } = await params;
    const role = req.headers.get('x-user-role');

    if (role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: admin role required' },
        { status: 403 }
      );
    }

    const cr = await CR.findByIdAndDelete(crId);

    if (!cr) {
      return NextResponse.json({ error: 'CR not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'CR deleted successfully' });
  } catch (error: unknown) {
    console.error('Delete CR error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
