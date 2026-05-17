import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { SiteContent } from '@/models';

// Allow Next.js to cache this route for 60 seconds
export const revalidate = 60;

export async function GET() {
  try {
    await connectDB();
    const items = await SiteContent.find({}).sort({ section: 1, key: 1 }).lean();
    return NextResponse.json(items || [], {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch content', detail: error?.message }, { status: 500 });
  }
}


export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { key, value, type = 'text', section, label } = body;

    const item = await SiteContent.findOneAndUpdate(
      { key },
      { key, value, type, section, label, updatedAt: new Date() },
      { upsert: true, new: true }
    );
    return NextResponse.json(item, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to save content', detail: error?.message }, { status: 500 });
  }
}
