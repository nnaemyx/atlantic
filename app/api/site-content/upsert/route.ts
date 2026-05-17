import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { SiteContent } from '@/models';
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { key, value, type = 'text', section, label } = body;

    if (!key) {
      return NextResponse.json({ error: 'key is required' }, { status: 400 });
    }

    const item = await SiteContent.findOneAndUpdate(
      { key },
      { key, value, type, section: section || key.split('.')[0], label: label || key, updatedAt: new Date() },
      { upsert: true, new: true }
    );

    // Revalidate the entire site cache so updates appear instantly on the frontend
    revalidatePath('/', 'layout');

    return NextResponse.json({ success: true, item });
  } catch (error: any) {
    console.error('Upsert content error:', error);
    return NextResponse.json({ error: 'Failed to save content', detail: error?.message }, { status: 500 });
  }
}
