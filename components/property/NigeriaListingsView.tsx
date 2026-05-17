'use client';

import { Building2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function NigeriaListingsView({ listings }: { listings: any[] }) {

  // Group listings by developer
  const groupedListings = listings.reduce((acc, listing) => {
    const dev = listing.developer || 'Other Developers';
    if (!acc[dev]) {
      acc[dev] = {
        name: dev,
        bio: listing.developerBio || '',
        logo: listing.developerLogo || '',
        properties: []
      };
    }
    acc[dev].properties.push(listing);
    // If a listing has a bio and the group doesn't, set it
    if (listing.developerBio && !acc[dev].bio) {
      acc[dev].bio = listing.developerBio;
    }
    return acc;
  }, {} as Record<string, { name: string, bio: string, logo: string, properties: any[] }>);

  const developers = Object.values(groupedListings) as Array<{ name: string; bio: string; logo: string; properties: any[] }>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {developers.map((dev) => (
        <Link 
          key={dev.name} 
          href={`/nigeria/developer/${encodeURIComponent(dev.name)}`}
          className="group bg-white rounded-3xl border border-zinc-100 shadow-sm overflow-hidden hover:border-brand-emerald/30 hover:shadow-xl transition-all duration-300 flex flex-col h-full"
        >
          <div className="p-8 flex-1 flex flex-col">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-emerald-50 text-brand-emerald rounded-2xl flex items-center justify-center border border-emerald-100 group-hover:bg-brand-emerald group-hover:text-white transition-colors">
                {dev.logo ? (
                  <img src={dev.logo} alt={dev.name} className="w-full h-full object-contain rounded-2xl" />
                ) : (
                  <Building2 className="h-8 w-8" />
                )}
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-brand-gold mb-1">Verified Partner</div>
                <h2 className="text-xl font-bold text-emerald-950 leading-tight">{dev.name}</h2>
              </div>
            </div>
            
            <p className="text-sm text-zinc-500 mb-6 line-clamp-3 leading-relaxed flex-1">
              {dev.bio || 'A premium real estate developer offering verified properties on the Atlantic platform.'}
            </p>
            
            <div className="flex items-center justify-between pt-6 border-t border-zinc-50 mt-auto">
              <div className="text-sm font-bold text-emerald-950">
                {dev.properties.length} Active Listing{dev.properties.length !== 1 && 's'}
              </div>
              <div className="w-8 h-8 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:bg-brand-emerald group-hover:text-white transition-colors">
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
