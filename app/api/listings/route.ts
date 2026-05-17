import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Listing } from '@/models';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const featured = searchParams.get('featured');

    let query: any = {};
    if (type) query.type = type;
    if (featured) query.featured = featured === 'true';

    const listings = await Listing.find(query).sort({ order: 1, createdAt: -1 });
    return NextResponse.json(listings || []);
  } catch (error) {
    console.error('Fetch Listings Error:', error);
    return NextResponse.json([], { status: 200 }); // Safety for .map()
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    if (body.beds === '') body.beds = undefined;
    if (body.rooms === '') body.rooms = undefined;

    // Auto-generate human-readable listingId: NG-01, UK-03, etc.
    const prefix = body.type === 'UK' ? 'UK' : 'NG';
    const count = await Listing.countDocuments({ type: body.type });
    const listingId = `${prefix}-${String(count + 1).padStart(2, '0')}`;

    console.log('Creating listing:', listingId, body.title);
    const listing = await Listing.create({ ...body, listingId });
    return NextResponse.json(listing, { status: 201 });
  } catch (error: any) {
    console.error('Listing Creation Error:', error);
    return NextResponse.json({ error: 'Failed to create listing', detail: error?.message }, { status: 500 });
  }
}
