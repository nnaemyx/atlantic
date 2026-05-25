import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PropertyListView from '@/components/property/PropertyListView';
import connectDB from '@/lib/db';
import { getDeveloperKey, getDeveloperNameRegex, normalizeDeveloperName } from '@/lib/developers';
import { Developer, Listing } from '@/models';
import Link from 'next/link';
import { Building2, ArrowLeft, MapPin, Home, Star, BadgeCheck, Phone } from 'lucide-react';

async function getDeveloperData(developerName: string) {
  try {
    await connectDB();
    const decodedName = normalizeDeveloperName(decodeURIComponent(developerName));
    const developerRegex = getDeveloperNameRegex(decodedName);

    const [listings, developer] = await Promise.all([
      Listing.find({ developer: developerRegex, type: 'Nigeria' }).sort({ order: 1, createdAt: -1 }).lean(),
      Developer.findOne({ nameKey: getDeveloperKey(decodedName) }).lean(),
    ]);

    return {
      developer,
      listings: listings.map((listing: any) => ({
        ...listing,
        _id: listing._id?.toString(),
        createdAt: listing.createdAt?.toString(),
        updatedAt: listing.updatedAt?.toString(),
      })),
    };
  } catch (error) {
    console.error('Failed to fetch developer properties:', error);
    return { developer: null, listings: [] };
  }
}

export const dynamic = 'force-dynamic';

export default async function DeveloperPage({ params }: { params: Promise<{ developer: string }> }) {
  const resolvedParams = await params;
  const { developer, listings } = await getDeveloperData(resolvedParams.developer);

  if (listings.length === 0) {
    return (
      <>
        <Navbar />
        <div className="pt-32 pb-24 text-center min-h-[60vh]">
          <Building2 className="h-12 w-12 text-zinc-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4 text-emerald-950">Developer Not Found</h1>
          <p className="text-zinc-500 mb-8">No properties found for this developer.</p>
          <Link href="/nigeria" className="btn-primary px-8 py-3 inline-block">
            ← Back to Nigeria Properties
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const developerName =
    developer?.name || normalizeDeveloperName(decodeURIComponent(resolvedParams.developer));
  const bio =
    developer?.bio ||
    listings.find((listing: any) => listing.developerBio)?.developerBio ||
    'A trusted developer on the Atlantic Property platform.';
  const totalUnits = developer?.units ?? listings.length;

  // Aggregate unique amenities from all properties
  const allAmenities = new Set<string>();
  listings.forEach((listing: any) => {
    [listing.amenity1, listing.amenity2, listing.amenity3, listing.amenity4, listing.amenity5, listing.amenity6].forEach(a => {
      if (a) allAmenities.add(a);
    });
  });
  const uniqueAmenities = Array.from(allAmenities);

  // Aggregate unique locations
  const locations = [...new Set(listings.map((l: any) => l.location).filter(Boolean))];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-zinc-50">

        {/* === HERO === */}
        <section className="relative bg-emerald-950 text-white overflow-hidden">
          {/* Decorative background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-brand-gold/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-800/30 rounded-full blur-3xl" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptMC0xMnY2aDZ2LTZoLTZ6bS0xMiAxMnY2aDZ2LTZoLTZ6bTAtMTJ2Nmg2di02aC02eiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
          </div>

          <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl pt-32 pb-20">
            {/* Back Link */}
            <Link href="/nigeria" className="inline-flex items-center gap-2 text-emerald-300/70 hover:text-white mb-10 transition-colors text-sm font-medium group">
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Nigeria Properties
            </Link>

          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start sm:items-center">
              {/* Logo / Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-gradient-to-br from-emerald-800 to-emerald-950 rounded-2xl sm:rounded-3xl flex items-center justify-center border-2 border-brand-gold/40 shadow-2xl shadow-black/40">
                  {developer?.logo ? (
                    <img
                      src={developer.logo}
                      alt={developerName}
                      className="w-full h-full object-contain rounded-2xl sm:rounded-3xl bg-white p-3 sm:p-4"
                    />
                  ) : (
                    <Building2 className="h-10 w-10 sm:h-14 sm:w-14 md:h-16 md:w-16 text-brand-gold" />
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-brand-gold rounded-xl px-2 py-1 flex items-center gap-1">
                  <BadgeCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-emerald-950" />
                  <span className="text-[9px] sm:text-[10px] font-black text-emerald-950 uppercase tracking-wider">Verified</span>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-brand-gold/80 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-2 sm:mb-3">Partner Developer</p>
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-black mb-4 sm:mb-6 leading-tight font-heading break-words">{developerName}</h1>

                {/* Quick stats */}
                <div className="flex flex-wrap gap-3 sm:gap-6">
                  <div className="flex items-center gap-2 text-emerald-100/70 text-sm">
                    <Home className="h-4 w-4 text-brand-gold" />
                    <span><strong className="text-white font-bold">{listings.length}</strong> Properties</span>
                  </div>
                  {locations.length > 0 && (
                    <div className="flex items-center gap-2 text-emerald-100/70 text-sm">
                      <MapPin className="h-4 w-4 text-brand-gold" />
                      <span><strong className="text-white font-bold">{locations[0]}{locations.length > 1 ? ` + ${locations.length - 1} more` : ''}</strong></span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-emerald-100/70 text-sm">
                    <Star className="h-4 w-4 text-brand-gold" />
                    <span><strong className="text-white font-bold">{totalUnits}</strong> Units</span>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="flex-shrink-0 w-full sm:w-auto">
                <Link
                  href={`/prequalify`}
                  className="btn-gold px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base w-full sm:w-auto text-center block sm:inline-block whitespace-nowrap"
                >
                  Enquire About Properties
                </Link>
              </div>
          </div>
        </div>

          {/* Bottom wave */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 40" xmlns="http://www.w3.org/2000/svg" className="w-full" preserveAspectRatio="none">
              <path d="M0,40 C360,0 1080,0 1440,40 L1440,40 L0,40 Z" fill="rgb(244,244,245)" />
            </svg>
          </div>
        </section>

        {/* === ABOUT + AMENITIES === */}
        <section className="py-16 bg-zinc-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-8">

              {/* Bio Card */}
              <div className="lg:col-span-2 bg-white rounded-3xl border border-zinc-100 shadow-sm p-8">
                <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">About the Developer</h2>
                <p className="text-zinc-700 text-lg leading-relaxed">
                  {bio}
                </p>

                {locations.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-zinc-100">
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Development Locations</p>
                    <div className="flex flex-wrap gap-2">
                      {locations.map((loc, i) => (
                        <span key={i} className="flex items-center gap-1 bg-zinc-50 border border-zinc-200 px-3 py-1.5 rounded-lg text-sm font-medium text-zinc-600">
                          <MapPin className="h-3.5 w-3.5 text-brand-emerald" />
                          {loc}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Stats + Contact Card */}
              <div className="space-y-4">
                {/* Stats */}
                <div className="bg-emerald-950 rounded-3xl p-6 text-white">
                  <h3 className="text-xs font-bold text-emerald-300/60 uppercase tracking-widest mb-5">At a Glance</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-100/60 text-sm">Active Listings</span>
                      <span className="font-black text-2xl text-brand-gold">{listings.length}</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-emerald-900 pt-4">
                      <span className="text-emerald-100/60 text-sm">Total Units</span>
                      <span className="font-black text-2xl text-brand-gold">{totalUnits}</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-emerald-900 pt-4">
                      <span className="text-emerald-100/60 text-sm">Locations</span>
                      <span className="font-black text-2xl text-brand-gold">{locations.length || 1}</span>
                    </div>
                  </div>
                </div>

                {/* Enquire CTA */}
                <div className="bg-brand-gold/10 border border-brand-gold/30 rounded-3xl p-6">
                  <Phone className="h-6 w-6 text-brand-gold mb-3" />
                  <p className="font-bold text-emerald-950 mb-1">Interested in a property?</p>
                  <p className="text-zinc-500 text-sm mb-4">Our team will connect you with this developer directly.</p>
                  <Link href="/prequalify" className="btn-gold text-sm py-3 w-full text-center block">
                    Start Enquiry
                  </Link>
                </div>
              </div>
            </div>

            {/* Amenities */}
            {uniqueAmenities.length > 0 && (
              <div className="mt-8 bg-white rounded-3xl border border-zinc-100 shadow-sm p-8">
                <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-5">Features & Amenities Offered</h2>
                <div className="flex flex-wrap gap-3">
                  {uniqueAmenities.map((amenity, idx) => (
                    <span key={idx} className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-4 py-2.5 rounded-xl text-sm font-semibold text-emerald-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* === PROPERTIES === */}
        <section className="py-16 bg-zinc-50 border-t border-zinc-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-10 gap-3">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-emerald-950 font-heading">
                  Properties by {developerName}
                </h2>
                <p className="text-zinc-500 mt-1 text-sm">{listings.length} listing{listings.length !== 1 ? 's' : ''} available</p>
              </div>
              <div className="hidden md:flex items-center gap-2 bg-emerald-950/5 rounded-full px-4 py-2">
                <Building2 className="h-4 w-4 text-brand-emerald" />
                <span className="text-sm font-bold text-emerald-950">Verified Developer</span>
              </div>
            </div>
            <PropertyListView
              listings={listings}
              market={developerName}
              hideDeveloperLink={true}
              hideSearch={true}
            />
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
