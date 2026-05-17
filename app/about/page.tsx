import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ShieldCheck, Target, Users, MapPin, CheckCircle, Globe, Landmark } from 'lucide-react';
import Link from 'next/link';
import { getAllCMS } from '@/lib/cms';

export const dynamic = 'force-dynamic';

export default async function AboutUs() {
  const cms = await getAllCMS();
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20 bg-brand-cream min-h-screen">
        {/* HERO */}
        <section className="bg-emerald-950 py-20 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-gold/10 skew-x-12 transform translate-x-20"></div>
          <div className="container mx-auto px-4 relative z-10 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white font-heading" dangerouslySetInnerHTML={{ __html: cms['about.hero.title'] || 'About <span class="text-brand-gold">Atlantic Property</span>' }} />
            <p className="text-emerald-100/70 text-lg md:text-xl max-w-3xl mx-auto mb-10">
              {cms['about.hero.subtitle'] || 'We are a premier real estate advisory firm dedicated to connecting Nigerians at home and in the diaspora with secure, high-yield investment opportunities in Nigeria and the UK.'}
            </p>
          </div>
        </section>

        {/* OUR STORY */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6 font-heading">{cms['about.mission.title'] || 'Our Mission'}</h2>
                <p className="text-zinc-600 leading-relaxed mb-6">
                  {cms['about.mission.p1'] || 'For years, Nigerians living abroad have struggled with the complexities and risks of investing back home. From unreliable developers to untrustworthy family members managing projects, the path to building real estate wealth has been fraught with anxiety.'}
                </p>
                <p className="text-zinc-600 leading-relaxed mb-6">
                  {cms['about.mission.p2'] || 'Similarly, accessing the lucrative UK property market often felt impossible due to stringent mortgage requirements and local market nuances.'}
                </p>
                <p className="text-zinc-600 leading-relaxed font-bold text-emerald-950">
                  {cms['about.mission.p3'] || 'Atlantic Property was built to solve this. We act as your secure bridge, vetting every developer, handling the legalities, and ensuring your capital is deployed safely into assets that appreciate.'}
                </p>
              </div>
              <div className="bg-brand-cream p-12 rounded-3xl border border-zinc-100">
                <div className="space-y-8">
                  <div className="flex gap-4">
                    <ShieldCheck className="h-8 w-8 text-brand-emerald flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-xl mb-2">Vetted Opportunities</h3>
                      <p className="text-zinc-500 text-sm">We strictly partner with developers who have a proven track record of timely delivery and impeccable structural integrity.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Target className="h-8 w-8 text-brand-emerald flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-xl mb-2">Data-Driven Strategy</h3>
                      <p className="text-zinc-500 text-sm">Every property we recommend is backed by solid market data, ensuring strong capital appreciation and high rental yields.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Users className="h-8 w-8 text-brand-emerald flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-xl mb-2">End-to-End Service</h3>
                      <p className="text-zinc-500 text-sm">From sourcing to legal conveyancing and property management, we handle the entire process seamlessly.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WHY CHOOSE US */}
        <section className="py-24 bg-zinc-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-16 font-heading">Why Partner With Us?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-100 text-center">
                <div className="w-16 h-16 bg-emerald-50 text-brand-emerald rounded-full flex items-center justify-center mx-auto mb-6">
                  <Globe className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-4">Dual Market Expertise</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  Deeply rooted in both the Nigerian and UK real estate landscapes, giving you unparalleled access to international portfolios.
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-100 text-center">
                <div className="w-16 h-16 bg-emerald-50 text-brand-emerald rounded-full flex items-center justify-center mx-auto mb-6">
                  <Landmark className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-4">Diaspora Mortgages</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  We facilitate specialized mortgage products that allow Nigerians living abroad to finance properties in Nigeria effortlessly.
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-100 text-center">
                <div className="w-16 h-16 bg-emerald-50 text-brand-emerald rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-4">100% Transparency</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  No hidden fees, no delayed projects. You get real-time updates and full legal backing on every transaction you make.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-brand-cream text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-heading">Ready to Build Your Portfolio?</h2>
            <p className="text-zinc-600 mb-10 max-w-2xl mx-auto">
              Schedule a strategy session with our senior advisors today and discover the safest path to real estate wealth.
            </p>
            <Link href="/prequalify" className="btn-gold px-12 py-4">
              Book a Strategy Call
            </Link>
          </div>
        </section>
      </main>
      <Footer initialCms={cms} />
    </>
  );
}
