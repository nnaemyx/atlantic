import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Listing } from '@/models';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    const listing = await Listing.findById(id);
    if (!listing) return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    return NextResponse.json(listing);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch listing', detail: error?.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    console.log('Deleting listing:', id);
    const listing = await Listing.findByIdAndDelete(id);
    if (!listing) return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    return NextResponse.json({ success: true, deleted: id });
  } catch (error: any) {
    console.error('Delete Listing Error:', error);
    return NextResponse.json({ error: 'Failed to delete listing', detail: error?.message }, { status: 500 });
  }
}
