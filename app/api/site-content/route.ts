import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { SiteContent } from '@/models';

export async function GET() {
  try {
    await connectDB();
    const items = await SiteContent.find({}).sort({ section: 1, key: 1 });
    return NextResponse.json(items || []);
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
