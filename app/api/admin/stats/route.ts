import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Lead, Listing, BlogPost } from '@/models';

export async function GET() {
  try {
    await connectDB();
    
    const [leads, listings, posts] = await Promise.all([
      Lead.find().sort({ createdAt: -1 }),
      Listing.find().sort({ createdAt: -1 }),
      BlogPost.find().sort({ createdAt: -1 })
    ]);

    // Simple analytics
    const totalLeads = leads.length;
    const nigeriaLeads = leads.filter(l => l.type === 'Nigeria').length;
    const ukLeads = leads.filter(l => l.type === 'UK').length;
    
    const highScoringLeads = leads.filter(l => l.score >= 50).length;
    
    // Revenue potential (mocked for demo, can be calculated from budgets)
    const estimatedPotential = leads.reduce((acc, l) => {
      const budget = parseInt(l.budget?.replace(/[^\d]/g, '') || '0');
      return acc + budget;
    }, 0);

    return NextResponse.json({
      stats: {
        totalLeads: totalLeads || 0,
        nigeriaLeads: nigeriaLeads || 0,
        ukLeads: ukLeads || 0,
        highScoringLeads: highScoringLeads || 0,
        totalListings: listings?.length || 0,
        totalPosts: posts?.length || 0,
        estimatedPotential: estimatedPotential || 0
      },
      recentLeads: leads?.slice(0, 5) || []
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
