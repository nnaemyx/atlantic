import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ListingCard from '@/components/property/ListingCard';
import Link from 'next/link';
import connectDB from '@/lib/db';
import { Listing } from '@/models';

// Fetch listings server-side (Next.js App Router SSR)
async function getNigeriaListings() {
  try {
    await connectDB();
    const listings = await Listing.find({ type: 'Nigeria' }).sort({ order: 1, createdAt: -1 }).lean();
    return listings;
  } catch (error) {
    console.error('Failed to fetch Nigeria listings:', error);
    return [];
  }
}

export const dynamic = 'force-dynamic';

export default async function NigeriaProperties() {
  const listings = await getNigeriaListings();

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20">
        <header className="bg-brand-emerald py-12 md:py-20 mb-12 md:mb-16 relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10 text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Nigeria Properties</h1>
            <p className="text-emerald-100/70 max-w-2xl mx-auto text-base md:text-lg">
              Secure your future with verified developments in Lagos and Abuja.{' '}
              Each project has been vetted for title, developer reliability, and delivery timeline.
            </p>
          </div>
          <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-gold/10 skew-x-12 transform translate-x-20"></div>
        </header>

        <section className="container mx-auto px-4 sm:px-6 lg:px-8">
          {listings.length > 0 ? (
            <div className="space-y-12">
              {listings.map((listing: any) => (
                <ListingCard
                  key={listing._id?.toString()}
                  listing={{
                    id: listing.listingId || listing._id?.toString(),
                    title: listing.title,
                    developer: listing.developer,
                    location: listing.location,
                    priceRange: listing.priceRange,
                    images: listing.images?.length > 0 ? listing.images : (listing.image ? [listing.image] : []),
                    overview: listing.overview,
                  }}
                />
              ))}
            </div>
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
          <div className="mt-24 bg-brand-cream border border-zinc-100 rounded-3xl p-12 text-center max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Didn&apos;t find what you like?</h2>
            <p className="text-zinc-600 text-lg mb-8">
              Our network covers over 50+ developers in Nigeria. We can source the ideal property
              based on your specific budget, location, and property type.
            </p>
            <Link href="/prequalify?market=Nigeria" className="btn-gold px-12 py-4 inline-block">
              Request Bespoke Sourcing
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
