import Link from 'next/link';
import { ShieldCheck, TrendingUp, Handshake, CheckCircle2, ArrowRight, MapPin } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
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
        <section className="relative min-h-[85vh] sm:h-[90vh] sm:min-h-[600px] flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src={cms['home.hero.image'] || "https://images.pexels.com/photos/37019091/pexels-photo-37019091.jpeg"} 
              alt="Luxury Real Estate" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-emerald-950/70 to-transparent"></div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-20">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/20 border border-brand-gold/30 text-brand-gold text-[10px] md:text-xs font-semibold uppercase tracking-wider mb-6">
                <CheckCircle2 className="h-3 w-3" />
                {cms['home.hero.tag'] || 'Trusted by Nigerians in the Diaspora'}
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-6 leading-[1.2] md:leading-[1.1]" dangerouslySetInnerHTML={{ __html: cms['home.hero.title'] || 'Invest in Nigerian Property <span class="text-brand-gold italic">Safely</span> From Abroad' }} />
              <h2 className="text-lg sm:text-xl md:text-3xl font-heading text-emerald-100/90 mb-6 sm:mb-8 font-light">
                {cms['home.hero.subtitle'] || '+ Buy UK Property Safely from Nigeria'}
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-emerald-50/70 mb-8 sm:mb-10 max-w-xl leading-relaxed">
                {cms['home.hero.text'] || 'Verified developers. Transparent projects. Legal documentation checks. The most secure path to high-yield real estate investments.'}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/nigeria" className="btn-gold text-center px-10 py-4">
                  View Nigeria Properties
                </Link>
                <Link href="/uk" className="btn-primary bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-center px-10 py-4">
                  Explore UK Property
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED NIGERIA LISTINGS */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div className="max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">{cms['home.nigeria.title'] || 'Featured Developments in Nigeria'}</h2>
                <p className="text-zinc-600">{cms['home.nigeria.subtitle'] || 'Hand-picked properties from verified developers across Lagos and Abuja.'}</p>
              </div>
              <Link href="/nigeria" className="flex items-center gap-2 text-brand-emerald font-semibold hover:text-brand-gold transition-colors">
                View All Nigeria Properties <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {nigeriaFeatured.length > 0 ? (
              /* Mobile: horizontal scroll snap; md+: 3-col grid */
              <div className="-mx-4 sm:mx-0">
                <div className="flex gap-4 overflow-x-auto pb-4 px-4 sm:px-0 snap-x snap-mandatory md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:pb-0 scrollbar-hide">
                  {nigeriaFeatured.map((listing: any) => (
                    <div key={listing._id?.toString()} className="group bg-brand-cream rounded-xl overflow-hidden border border-zinc-100 shadow-sm hover:shadow-xl transition-all duration-300 flex-shrink-0 w-[80vw] sm:w-[60vw] md:w-auto snap-start">
                      <div className="relative h-52 sm:h-56 md:h-64 overflow-hidden">
                        {listing.image || (listing.images && listing.images[0]) ? (
                          <img
                            src={listing.image || listing.images[0]}
                            alt={listing.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-zinc-100 flex items-center justify-center">
                            <span className="text-zinc-400 text-sm">No image</span>
                          </div>
                        )}
                      </div>
                      <div className="p-4 sm:p-6">
                        <h3 className="text-base sm:text-xl font-bold mb-1 line-clamp-2">{listing.title}</h3>
                        <div className="flex items-center gap-1 text-zinc-500 text-xs sm:text-sm mb-4">
                          <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                          <span className="truncate">{listing.location}</span>
                        </div>
                        <div className="flex justify-between items-center border-t border-zinc-100 pt-3 sm:pt-4">
                          <div>
                            <p className="text-[10px] uppercase text-zinc-400 font-bold">Price Range</p>
                            <p className="font-bold text-brand-emerald text-sm sm:text-base">{listing.priceRange}</p>
                          </div>
                          <Link href="/prequalify" className="text-brand-gold font-bold text-sm hover:underline">Enquire</Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-brand-cream rounded-2xl border border-zinc-100 p-12 text-center">
                <p className="text-zinc-500 text-sm">No featured Nigeria listings yet.</p>
                <p className="text-zinc-400 text-xs mt-1">Add listings via admin and mark them as Featured.</p>
              </div>
            )}
          </div>
        </section>

        {/* FEATURED UK LISTINGS — only show if there are UK featured listings */}
        {ukFeatured.length > 0 && (
          <section className="py-24 bg-zinc-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                <div className="max-w-2xl">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">{cms['home.uk.title'] || 'Featured UK Opportunities'}</h2>
                  <p className="text-zinc-600">{cms['home.uk.subtitle'] || 'Curated UK properties sourced for Nigerian diaspora investors.'}</p>
                </div>
                <Link href="/uk" className="flex items-center gap-2 text-brand-emerald font-semibold hover:text-brand-gold transition-colors">
                  View All UK Properties <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="-mx-4 sm:mx-0">
                <div className="flex gap-4 overflow-x-auto pb-4 px-4 sm:px-0 snap-x snap-mandatory md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:pb-0 scrollbar-hide">
                  {ukFeatured.map((listing: any) => (
                    <div key={listing._id?.toString()} className="group bg-white rounded-xl overflow-hidden border border-zinc-100 shadow-sm hover:shadow-xl transition-all duration-300 flex-shrink-0 w-[80vw] sm:w-[60vw] md:w-auto snap-start">
                      <div className="relative h-52 sm:h-56 md:h-64 overflow-hidden">
                        {listing.image || (listing.images && listing.images[0]) ? (
                          <img
                            src={listing.image || listing.images[0]}
                            alt={listing.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-zinc-100 flex items-center justify-center">
                            <span className="text-zinc-400 text-sm">No image</span>
                          </div>
                        )}
                      </div>
                      <div className="p-4 sm:p-6">
                        <h3 className="text-base sm:text-xl font-bold mb-1 line-clamp-2">{listing.title}</h3>
                        <div className="flex items-center gap-1 text-zinc-500 text-xs sm:text-sm mb-4">
                          <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                          <span className="truncate">{listing.location}</span>
                        </div>
                        <div className="flex justify-between items-center border-t border-zinc-100 pt-3 sm:pt-4">
                          <div>
                            <p className="text-[10px] uppercase text-zinc-400 font-bold">Price Range</p>
                            <p className="font-bold text-blue-700 text-sm sm:text-base">{listing.priceRange}</p>
                          </div>
                          <Link href="/prequalify?market=UK" className="text-brand-gold font-bold text-sm hover:underline">Enquire</Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* WHY US SECTION */}
        <section className="py-24 bg-brand-cream border-y border-zinc-100" id="why-us">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">{cms['home.why.title'] || 'Why Invest With Atlantic?'}</h2>
              <p className="text-zinc-600 text-lg">{cms['home.why.subtitle'] || 'We bridge the gap between diaspora buyers and reliable developers with a trust-first approach.'}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-50 hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-brand-emerald mb-6">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Verified Developers Only</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">We conduct rigorous background checks on every developer before listing.</p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-50 hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-brand-emerald mb-6">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Access to Mortgages</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">Exclusive access to government-backed MREIF Home Loans at 9.75%.</p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-50 hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-brand-emerald mb-6">
                  <Handshake className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">End-to-End Transparency</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">Regular project updates, live site feeds, and transparent documentation.</p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-50 hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-brand-emerald mb-6">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Legal Documentation</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">All projects come with verified C of O or equivalents, legally vetted.</p>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-24 bg-brand-emerald text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
            <ShieldCheck className="w-96 h-96 -mr-20 -mt-20" />
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-5xl font-bold mb-8 text-white leading-tight">{cms['home.process.title'] || 'Simplify Your Investment Journey'}</h2>
                <div className="space-y-12">
                  <div className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-brand-gold rounded-full flex items-center justify-center text-emerald-950 font-bold text-xl">1</div>
                    <div>
                      <h3 className="text-xl font-bold mb-2 text-brand-gold">{cms['home.process.step1.title'] || 'Browse Verified Properties'}</h3>
                      <p className="text-emerald-100/70">{cms['home.process.step1.text'] || 'Explore our curated list of developments in Nigeria and the UK.'}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-brand-gold rounded-full flex items-center justify-center text-emerald-950 font-bold text-xl">2</div>
                    <div>
                      <h3 className="text-xl font-bold mb-2 text-brand-gold">{cms['home.process.step2.title'] || 'Submit Enquiry'}</h3>
                      <p className="text-emerald-100/70">{cms['home.process.step2.text'] || 'Fill our pre-qualification form to help us understand your needs.'}</p>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-brand-gold rounded-full flex items-center justify-center text-emerald-950 font-bold text-xl">3</div>
                    <div>
                      <h3 className="text-xl font-bold mb-2 text-brand-gold">{cms['home.process.step3.title'] || 'Get Matched + Verified'}</h3>
                      <p className="text-emerald-100/70">{cms['home.process.step3.text'] || 'Our consultants match you with the best project and guide you to completion.'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-12">
                  <Link href="/prequalify" className="btn-gold inline-block px-12 py-4 text-lg">
                    Start Your Journey
                  </Link>
                </div>
              </div>
              
              <div className="relative">
                <div className="aspect-square rounded-3xl overflow-hidden border-4 border-white/10">
                  <Image src="https://images.pexels.com/photos/7641842/pexels-photo-7641842.jpeg" alt="Consultation" fill className="object-cover" sizes="(max-width:768px) 100vw, 50vw" />
                </div>
                <div className="absolute -bottom-6 -left-6 glass-card p-6 rounded-2xl max-w-xs border-brand-gold/30">
                  <p className="text-brand-emerald font-bold mb-1 italic">&quot;The safest way I&apos;ve found to buy back home while living in London.&quot;</p>
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
