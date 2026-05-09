import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { BlogPost } from '@/models';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const published = searchParams.get('published');

    let query: any = {};
    if (published) query.published = published === 'true';

    const posts = await BlogPost.find(query).sort({ createdAt: -1 });
    return NextResponse.json(posts || []);
  } catch (error) {
    console.error('Fetch Blog Error:', error);
    return NextResponse.json([], { status: 200 }); // Return empty array even on error for safety in .map()
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    
    // Create slug if not provided
    if (!body.slug && body.title) {
      body.slug = body.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    }
    
    const post = await BlogPost.create(body);
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Blog Post Creation Error:', error);
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
  }
}
