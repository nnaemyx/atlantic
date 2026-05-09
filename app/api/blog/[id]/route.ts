import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { BlogPost } from '@/models';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    const body = await request.json();
    
    // Automatically generate slug if title changed, or keep it.
    if (body.title) {
      body.slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    const post = await BlogPost.findByIdAndUpdate(id, body, { new: true });
    if (!post) return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    return NextResponse.json(post);
  } catch (error: any) {
    console.error('Update Blog Post Error:', error);
    return NextResponse.json({ error: 'Failed to update blog post', detail: error?.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    const post = await BlogPost.findByIdAndDelete(id);
    if (!post) return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    return NextResponse.json({ success: true, deleted: id });
  } catch (error: any) {
    console.error('Delete Blog Post Error:', error);
    return NextResponse.json({ error: 'Failed to delete blog post', detail: error?.message }, { status: 500 });
  }
}
