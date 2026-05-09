import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Lead } from '@/models';

export async function GET() {
  try {
    await connectDB();
    const leads = await Lead.find().sort({ createdAt: -1 });
    return NextResponse.json(leads || []);
  } catch (error) {
    console.error('Fetch Leads Error:', error);
    return NextResponse.json([], { status: 200 }); // Safety for .map()
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    
    // Scoring logic
    let score = 40; // Base score
    if (body.budget === '₦100M - ₦250M' || body.budget === 'Above ₦250M') score += 25;
    else if (body.budget === '₦50M - ₦100M') score += 15;
    
    if (body.fundingType === 'Cash') score += 25;
    else if (body.fundingType === 'Mortgage') score += 10;
    
    if (body.employmentStatus === 'Employed') score += 10;
    
    const lead = await Lead.create({
      ...body,
      score,
      data: body // Store full form data
    });
    
    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    console.error('Lead Submission Error:', error);
    return NextResponse.json({ error: 'Failed to submit lead' }, { status: 500 });
  }
}
