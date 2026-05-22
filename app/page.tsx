import Link from 'next/link';
import { ShieldCheck, TrendingUp, Handshake, CheckCircle2, ArrowRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FeaturedCard from '@/components/property/FeaturedCard';
import connectDB from '@/lib/db';
import { Listing } from '@/models';
import { getAllCMS } from '@/lib/cms';


async function getFeaturedListings() {
  try {
    await connectDB();
    const listings = await Listing.find({ featured: true })
      .sort({ order: 1, createdAt: -1 })
      .limit(6)
      .lean();
    return listings.map((l: any) => ({
      ...l,
      _id: l._id?.toString(),
      createdAt: l.createdAt?.toString(),
      updatedAt: l.updatedAt?.toString(),
    }));
  } catch (error) {
    console.error('Failed to fetch featured listings:', error);
    return [];
  }
}

export const dynamic = 'force-dynamic';

export default async function Home() {
  const featuredListings = await getFeaturedListings();
  const cms = await getAllCMS();

  // Split featured listings into Nigeria and UK
  const nigeriaFeatured = featuredListings.filter((l: any) => l.type === 'Nigeria').slice(0, 3);
  const ukFeatured = featuredListings.filter((l: any) => l.type === 'UK').slice(0, 3);

  return (
    <>
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative min-h-[88vh] sm:min-h-[92vh] flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src={cms['home.hero.image'] || "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg"}
              alt="Luxury Real Estate"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/92 via-emerald-950/70 to-emerald-950/30"></div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-24 pb-16">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/20 border border-brand-gold/30 text-brand-gold text-[10px] md:text-xs font-semibold uppercase tracking-wider mb-5">
                <CheckCircle2 className="h-3 w-3" />
                {cms['home.hero.tag'] || 'Trusted by Nigerians in the Diaspora'}
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-5 leading-[1.15] md:leading-[1.1]" dangerouslySetInnerHTML={{ __html: cms['home.hero.title'] || 'Invest in Nigerian Property <span class="text-brand-gold italic">Safely</span> From Abroad' }} />
              <h2 className="text-lg sm:text-xl md:text-2xl font-heading text-emerald-100/90 mb-5 sm:mb-6 font-light">
                {cms['home.hero.subtitle'] || '+ Buy UK Property Safely from Nigeria'}
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-emerald-50/70 mb-8 sm:mb-10 max-w-xl leading-relaxed">
                {cms['home.hero.text'] || 'Verified developers. Transparent projects. Legal documentation checks. The most secure path to high-yield real estate investments.'}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link href="/nigeria" className="btn-gold text-center px-8 py-3.5">
                  View Nigeria Properties
                </Link>
                <Link href="/uk" className="btn-primary bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-center px-8 py-3.5">
                  Explore UK Property
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED NIGERIA LISTINGS */}
        <section className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
              <div className="max-w-2xl">
                <p className="text-xs font-bold text-brand-gold uppercase tracking-widest mb-2">Nigeria Listings</p>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">{cms['home.nigeria.title'] || 'Featured Developments in Nigeria'}</h2>
                <p className="text-zinc-500 text-sm">{cms['home.nigeria.subtitle'] || 'Hand-picked properties from verified developers across Lagos and Abuja.'}</p>
              </div>
              <Link href="/nigeria" className="flex items-center gap-2 text-brand-emerald font-semibold hover:text-brand-gold transition-colors text-sm whitespace-nowrap">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {nigeriaFeatured.length > 0 ? (
              <div className="-mx-4 sm:mx-0">
                <div className="flex gap-4 overflow-x-auto pb-4 px-4 sm:px-0 snap-x snap-mandatory md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:pb-0 scrollbar-hide">
                  {nigeriaFeatured.map((listing: any) => (
                    <FeaturedCard
                      key={listing._id?.toString()}
                      listing={{
                        id: listing._id?.toString(),
                        title: listing.title,
                        developer: listing.developer,
                        location: listing.location,
                        priceRange: listing.priceRange,
                        images: listing.images?.length > 0 ? listing.images : (listing.image ? [listing.image] : []),
                        overview: listing.overview,
                        beds: listing.beds,
                        rooms: listing.rooms,
                        amenity1: listing.amenity1,
                        amenity2: listing.amenity2,
                        amenity3: listing.amenity3,
                        amenity4: listing.amenity4,
                        amenity5: listing.amenity5,
                        amenity6: listing.amenity6,
                        type: 'Nigeria'
                      }}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-brand-cream rounded-2xl border border-zinc-100 p-10 text-center">
                <p className="text-zinc-500 text-sm">No featured Nigeria listings yet.</p>
                <p className="text-zinc-400 text-xs mt-1">Add listings via admin and mark them as Featured.</p>
              </div>
            )}
          </div>
        </section>

        {/* FEATURED UK LISTINGS — only show if there are UK featured listings */}
        {ukFeatured.length > 0 && (
          <section className="py-12 md:py-16 bg-zinc-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                <div className="max-w-2xl">
                  <p className="text-xs font-bold text-brand-gold uppercase tracking-widest mb-2">UK Listings</p>
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">{cms['home.uk.title'] || 'Featured UK Opportunities'}</h2>
                  <p className="text-zinc-500 text-sm">{cms['home.uk.subtitle'] || 'Curated UK properties sourced for Nigerian diaspora investors.'}</p>
                </div>
                <Link href="/uk" className="flex items-center gap-2 text-brand-emerald font-semibold hover:text-brand-gold transition-colors text-sm whitespace-nowrap">
                  View All <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="-mx-4 sm:mx-0">
                <div className="flex gap-4 overflow-x-auto pb-4 px-4 sm:px-0 snap-x snap-mandatory md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:pb-0 scrollbar-hide">
                  {ukFeatured.map((listing: any) => (
                    <FeaturedCard
                      key={listing._id?.toString()}
                      listing={{
                        id: listing._id?.toString(),
                        title: listing.title,
                        developer: listing.developer,
                        location: listing.location,
                        priceRange: listing.priceRange,
                        images: listing.images?.length > 0 ? listing.images : (listing.image ? [listing.image] : []),
                        overview: listing.overview,
                        beds: listing.beds,
                        rooms: listing.rooms,
                        amenity1: listing.amenity1,
                        amenity2: listing.amenity2,
                        amenity3: listing.amenity3,
                        amenity4: listing.amenity4,
                        amenity5: listing.amenity5,
                        amenity6: listing.amenity6,
                        type: 'UK'
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* WHY US SECTION */}
        <section className="py-12 md:py-16 bg-brand-cream border-y border-zinc-100" id="why-us">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <p className="text-xs font-bold text-brand-gold uppercase tracking-widest mb-2">Why Us</p>
              <h2 className="text-2xl md:text-4xl font-bold mb-4">{cms['home.why.title'] || 'Why Invest With My Property Centre?'}</h2>
              <p className="text-zinc-600">{cms['home.why.subtitle'] || 'We bridge the gap between diaspora buyers and reliable developers with a trust-first approach.'}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-50 hover:-translate-y-1 transition-all duration-300">
                <div className="w-11 h-11 bg-emerald-50 rounded-xl flex items-center justify-center text-brand-emerald mb-5">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold mb-2">Verified Developers Only</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">We conduct rigorous background checks on every developer before listing.</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-50 hover:-translate-y-1 transition-all duration-300">
                <div className="w-11 h-11 bg-emerald-50 rounded-xl flex items-center justify-center text-brand-emerald mb-5">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold mb-2">Access to Mortgages</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">Exclusive access to government-backed MREIF Home Loans at 9.75%.</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-50 hover:-translate-y-1 transition-all duration-300">
                <div className="w-11 h-11 bg-emerald-50 rounded-xl flex items-center justify-center text-brand-emerald mb-5">
                  <Handshake className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold mb-2">End-to-End Transparency</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">Regular project updates, live site feeds, and transparent documentation.</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-50 hover:-translate-y-1 transition-all duration-300">
                <div className="w-11 h-11 bg-emerald-50 rounded-xl flex items-center justify-center text-brand-emerald mb-5">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold mb-2">Legal Documentation</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">All projects come with verified C of O or equivalents, legally vetted.</p>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-12 md:py-16 bg-brand-emerald text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
            <ShieldCheck className="w-96 h-96 -mr-20 -mt-20" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div>
                <p className="text-xs font-bold text-brand-gold uppercase tracking-widest mb-3">How It Works</p>
                <h2 className="text-2xl md:text-4xl font-bold mb-7 text-white leading-tight">{cms['home.process.title'] || 'Simplify Your Investment Journey'}</h2>
                <div className="space-y-8">
                  <div className="flex gap-5">
                    <div className="flex-shrink-0 w-11 h-11 bg-brand-gold rounded-full flex items-center justify-center text-emerald-950 font-bold text-lg">1</div>
                    <div>
                      <h3 className="text-lg font-bold mb-1.5 text-brand-gold">{cms['home.process.step1.title'] || 'Browse Verified Properties'}</h3>
                      <p className="text-emerald-100/70 text-sm leading-relaxed">{cms['home.process.step1.text'] || 'Explore our curated list of developments in Nigeria and the UK.'}</p>
                    </div>
                  </div>

                  <div className="flex gap-5">
                    <div className="flex-shrink-0 w-11 h-11 bg-brand-gold rounded-full flex items-center justify-center text-emerald-950 font-bold text-lg">2</div>
                    <div>
                      <h3 className="text-lg font-bold mb-1.5 text-brand-gold">{cms['home.process.step2.title'] || 'Submit Enquiry'}</h3>
                      <p className="text-emerald-100/70 text-sm leading-relaxed">{cms['home.process.step2.text'] || 'Fill our pre-qualification form to help us understand your needs.'}</p>
                    </div>
                  </div>

                  <div className="flex gap-5">
                    <div className="flex-shrink-0 w-11 h-11 bg-brand-gold rounded-full flex items-center justify-center text-emerald-950 font-bold text-lg">3</div>
                    <div>
                      <h3 className="text-lg font-bold mb-1.5 text-brand-gold">{cms['home.process.step3.title'] || 'Get Matched + Verified'}</h3>
                      <p className="text-emerald-100/70 text-sm leading-relaxed">{cms['home.process.step3.text'] || 'Our consultants match you with the best project and guide you to completion.'}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <Link href="/prequalify" className="btn-gold inline-block px-10 py-3.5 text-base">
                    Start Your Journey
                  </Link>
                </div>
              </div>

              <div className="relative">
                <div className="aspect-square rounded-3xl overflow-hidden border-4 border-white/10 relative">
                  <img
                    src="https://images.pexels.com/photos/8293778/pexels-photo-8293778.jpeg"
                    alt="Black couple consulting with property advisor"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 glass-card p-5 rounded-2xl max-w-xs border-brand-gold/30">
                  <p className="text-brand-emerald font-bold mb-1 italic text-sm">&quot;The safest way I&apos;ve found to buy back home while living in London.&quot;</p>
                  <p className="text-zinc-500 text-xs">— Dr. Amadi, NHS UK</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer initialCms={cms} />
    </>
  );
}
