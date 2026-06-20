import { NextResponse } from 'next/server';
import { fetchHighlightDetails } from '@/lib/instagram';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID de destacado requerido' }, { status: 400 });
    }
    const stories = await fetchHighlightDetails(id);
    return NextResponse.json({ success: true, stories });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
