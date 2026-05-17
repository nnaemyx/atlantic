import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PropertyListView from '@/components/property/PropertyListView';
import Link from 'next/link';
import Image from 'next/image';
import connectDB from '@/lib/db';
import { Listing } from '@/models';
import { getAllCMS } from '@/lib/cms';
import { AlertTriangle, CheckCircle, ShieldCheck } from 'lucide-react';

const locations = [
  { name: 'London', image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg', description: 'Capital growth and global stability.' },
  { name: 'Manchester', image: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg', description: 'High rental yields and regeneration.' },
  { name: 'Birmingham', image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg', description: 'Strategic growth and HS2 proximity.' }
];

async function getUKListings() {
  try {
    await connectDB();
    const listings = await Listing.find({ type: 'UK' }).sort({ order: 1, createdAt: -1 }).lean();
    return listings.map((l: any) => ({
      ...l,
      _id: l._id?.toString(),
      createdAt: l.createdAt?.toString(),
      updatedAt: l.updatedAt?.toString(),
    }));
  } catch (error) {
    console.error('Failed to fetch UK listings:', error);
    return [];
  }
}

export const dynamic = 'force-dynamic';

export default async function UKProperty() {
  const ukListings = await getUKListings();
  const cms = await getAllCMS();
  return (
    <>
      <Navbar />
      <main className="pt-24">
        {/* HERO */}
        <section className="bg-brand-emerald py-16 md:py-24 text-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl md:text-4xl font-bold mb-6 text-brand-gold" dangerouslySetInnerHTML={{ __html: cms['uk.hero.title'] || 'Buy UK Property with Confidence—<span class="text-brand-gold italic">Even If You’re Not in the UK</span>' }} />
            <p className="text-emerald-100/70 text-base md:text-lg max-w-3xl mx-auto mb-10">
              {cms['uk.hero.subtitle'] || 'We help Nigerians secure high-yielding UK real estate with full transparency, local market expertise, and secure legal support.'}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <Link href="/prequalify?market=UK" className="btn-gold px-8 sm:px-10 py-3 sm:py-4 text-sm sm:text-base text-center">Book Strategy Call</Link>
            </div>
          </div>
        </section>

        {/* PROBLEM / SOLUTION */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="flex items-center gap-2 text-red-600 mb-4">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="font-bold text-sm uppercase">Common Pain Points</span>
                </div>
                <h2 className="text-3xl font-bold mb-8">Why Most Nigerians Fail in UK Property</h2>
                <ul className="space-y-6">
                  <li className="flex gap-4">
                    <XCircle className="h-6 w-6 text-red-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-bold">Information Overload</p>
                      <p className="text-sm text-zinc-500">Too many "deals" online with no way to verify local demand.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <XCircle className="h-6 w-6 text-red-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-bold">Legal Complexity</p>
                      <p className="text-sm text-zinc-500">Navigating stamp duty, conveyancing, and tax from abroad is risky.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <XCircle className="h-6 w-6 text-red-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-bold">Funding Barriers</p>
                      <p className="text-sm text-zinc-500">Opening UK bank accounts and securing mortgages is getting harder.</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-brand-cream p-12 rounded-3xl border border-zinc-100">
                <div className="flex items-center gap-2 text-brand-emerald mb-4">
                  <ShieldCheck className="h-6 w-6" />
                  <span className="font-bold text-sm uppercase">Our Solution</span>
                </div>
                <h2 className="text-3xl font-bold mb-8">The Atlantic SecurePath</h2>
                <div className="space-y-8">
                  <div className="flex gap-4">
                    <CheckCircle className="h-6 w-6 text-brand-emerald mt-1 flex-shrink-0" />
                    <p className="text-zinc-700"><span className="font-bold">Bespoke Sourcing:</span> We find properties that match your ROI goals, not just what's on the market.</p>
                  </div>
                  <div className="flex gap-4">
                    <CheckCircle className="h-6 w-6 text-brand-emerald mt-1 flex-shrink-0" />
                    <p className="text-zinc-700"><span className="font-bold">Vetted Network:</span> Direct access to solicitors and tax experts specializing in diaspora investors.</p>
                  </div>
                  <div className="flex gap-4">
                    <CheckCircle className="h-6 w-6 text-brand-emerald mt-1 flex-shrink-0" />
                    <p className="text-zinc-700"><span className="font-bold">Management:</span> Full end-to-end management so you never have to deal with tenants.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* LOCATIONS */}
        <section className="py-24 bg-zinc-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-16 font-heading">Key Investment Locations</h2>
            {/* Mobile: horizontal scroll, desktop: 3-col grid */}
            <div className="-mx-4 sm:mx-0">
              <div className="flex gap-4 overflow-x-auto pb-4 px-4 sm:px-0 snap-x snap-mandatory md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:pb-0 scrollbar-hide">
                {locations.map((loc) => (
                  <div key={loc.name} className="bg-white rounded-2xl overflow-hidden shadow-sm group flex-shrink-0 w-[72vw] sm:w-[55vw] md:w-auto snap-start">
                    <div className="h-44 sm:h-56 md:h-64 relative overflow-hidden">
                      <Image src={loc.image} alt={loc.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width:768px) 72vw, 33vw" />
                    </div>
                    <div className="p-5 sm:p-8">
                      <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">{loc.name}</h3>
                      <p className="text-zinc-500 text-sm">{loc.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* UK LISTINGS from Admin */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 sm:mb-12 gap-4">
              <div className="max-w-2xl">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4">Available UK Properties</h2>
                <p className="text-zinc-600 text-sm sm:text-base">Curated opportunities sourced by our UK-based team.</p>
              </div>
            </div>
            {ukListings.length > 0 ? (
              <PropertyListView listings={ukListings} market="UK" hideDeveloperLink />
            ) : (
              <div className="py-20 text-center bg-brand-cream rounded-3xl border border-zinc-100">
                <p className="text-zinc-500 font-medium">UK property listings will appear here once added via admin.</p>
                <Link href="/prequalify?market=UK" className="btn-gold px-10 py-3 inline-block mt-6">
                  Request a UK Property
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* COMPLIANCE DISCLAIMER */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto p-8 rounded-xl border-l-4 border-brand-gold bg-zinc-50 text-xs text-zinc-500 leading-relaxed italic">
              <p className="font-bold mb-2 uppercase tracking-widest text-zinc-700 not-italic">Mandatory Compliance Disclaimer</p>
              Atlantic Property Partners is not a mortgage broker or financial advisor. We do not provide direct mortgage advice. Investment in property carries risks and value can go down as well as up. We recommend all investors seek independent legal and financial advice before proceeding. Reference: Financial Conduct Authority guidelines for property marketing.
            </div>
          </div>
        </section>

      </main>
      <Footer initialCms={cms} />
    </>
  );
}

function XCircle({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" /></svg>
  )
}
