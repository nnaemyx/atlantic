import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PropertyListView from '@/components/property/PropertyListView';
import Link from 'next/link';
import connectDB from '@/lib/db';
import { Listing } from '@/models';
import { getAllCMS } from '@/lib/cms';

// Fetch listings server-side (Next.js App Router SSR)
async function getNigeriaListings() {
  try {
    await connectDB();
    const listings = await Listing.find({ type: 'Nigeria' }).sort({ order: 1, createdAt: -1 }).lean();
    return listings.map((l: any) => ({
      ...l,
      _id: l._id?.toString(),
      createdAt: l.createdAt?.toString(),
      updatedAt: l.updatedAt?.toString(),
    }));
  } catch (error) {
    console.error('Failed to fetch Nigeria listings:', error);
    return [];
  }
}

export const dynamic = 'force-dynamic';

export default async function NigeriaProperties() {
  const listings = await getNigeriaListings();
  const cms = await getAllCMS();

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20">
        <header className="bg-brand-emerald py-12 md:py-20 mb-8 md:mb-12 relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10 text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{cms['nigeria.hero.title'] || 'Nigeria Properties'}</h1>
            <p className="text-emerald-100/70 max-w-2xl mx-auto text-base md:text-lg">
              {cms['nigeria.hero.subtitle'] || 'Secure your future with verified developments in Lagos and Abuja. Each project has been vetted for title, developer reliability, and delivery timeline.'}
            </p>
          </div>
          <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-gold/10 skew-x-12 transform translate-x-20"></div>
        </header>

        <section className="container mx-auto px-4 sm:px-6 lg:px-8">
          {listings.length > 0 ? (
            <>
              <div className="text-center mb-2">
                <span className="text-[10px] uppercase tracking-widest font-bold text-brand-gold">Exclusive Offers</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-10 text-zinc-800">Available Projects</h2>
              <PropertyListView listings={listings} market="Nigeria" />
            </>
          ) : (
            <div className="py-24 text-center">
              <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-zinc-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-zinc-800 mb-2">No Nigeria Listings Yet</h2>
              <p className="text-zinc-500 text-sm mb-6">Listings added via the admin panel will appear here.</p>
              <Link href="/prequalify?market=Nigeria" className="btn-gold px-8 py-3 inline-block">
                Register Interest
              </Link>
            </div>
          )}

          {/* Sourcing Section */}
          <div className="mt-10 sm:mt-16 bg-brand-cream border border-zinc-100 rounded-2xl sm:rounded-3xl p-6 sm:p-10 text-center max-w-4xl mx-auto">
            <span className="text-[10px] uppercase tracking-widest font-bold text-brand-gold block mb-2">Custom Request</span>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Didn&apos;t find what you like?</h2>
            <p className="text-zinc-600 text-base sm:text-lg mb-6 sm:mb-8">
              Our network covers over 50+ developers in Nigeria. We can source the ideal property
              based on your specific budget, location, and property type.
            </p>
            <Link href="/prequalify?market=Nigeria" className="btn-gold px-8 sm:px-12 py-3 sm:py-4 inline-block text-sm sm:text-base">
              Request Bespoke Sourcing
            </Link>
          </div>
        </section>
      </main>
      <Footer initialCms={cms} />
    </>
  );
}
