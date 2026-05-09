import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AccordionItem from '@/components/ui/AccordionItem';
import { TrendingDown, Landmark, Calendar, Wallet, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function MortgagePage() {
  const mortgageTerms = [
    { label: 'Interest Rate', value: '9.75%', icon: TrendingDown },
    { label: 'Max Loan Amount', value: '₦100,000,000', icon: Landmark },
    { label: 'Minimum Equity', value: '10%', icon: Wallet },
    { label: 'Repayment Tenor', value: 'Up to 20 Years', icon: Calendar },
  ];

  return (
    <>
      <Navbar />
      <main className="pt-24">
        {/* HERO */}
        <section className="bg-brand-emerald py-24 relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Diaspora Mortgages That Actually <span className="text-brand-gold italic">Work</span>
              </h1>
              <p className="text-emerald-100/70 text-lg mb-10">
                In partnership with the Ministry of Finance Incorporated, we bring you the MREIF Home Loan. Designed specifically for Nigerians living abroad to own property back home.
              </p>
              <Link href="/prequalify" className="btn-gold px-12 py-4">Check Mortgage Eligibility</Link>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-1/2 h-full hidden lg:block opacity-20">
            <img src="https://images.pexels.com/photos/8293768/pexels-photo-8293768.jpeg" alt="Mortgage Office" className="w-full h-full object-cover" />
          </div>
        </section>

        {/* TERMS GRID */}
        <section className="py-24 bg-brand-cream">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-16">MREIF Home Loan Key Terms</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {mortgageTerms.map((term) => (
                <div key={term.label} className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-50 text-center">
                  <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-brand-emerald mx-auto mb-6">
                    <term.icon className="h-6 w-6" />
                  </div>
                  <p className="text-[10px] uppercase font-bold text-zinc-400 mb-2 tracking-widest">{term.label}</p>
                  <h3 className="text-2xl font-bold text-brand-emerald">{term.value}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ELIGIBILITY LIST */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-8">Who Can Apply?</h2>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <CheckCircle2 className="h-6 w-6 text-brand-emerald flex-shrink-0" />
                    <p className="text-zinc-700">Nigerian citizens living and working abroad with a valid NIN.</p>
                  </div>
                  <div className="flex gap-4">
                    <CheckCircle2 className="h-6 w-6 text-brand-emerald flex-shrink-0" />
                    <p className="text-zinc-700">Minimum monthly net income of ₦1,000,000 (equivalent in USD/GBP/EUR).</p>
                  </div>
                  <div className="flex gap-4">
                    <CheckCircle2 className="h-6 w-6 text-brand-emerald flex-shrink-0" />
                    <p className="text-zinc-700">Employees or business owners with at least 3 years of verifiable track record.</p>
                  </div>
                  <div className="flex gap-4">
                    <CheckCircle2 className="h-6 w-6 text-brand-emerald flex-shrink-0" />
                    <p className="text-zinc-700">Buyers targeting residential properties in approved urban locations.</p>
                  </div>
                </div>
              </div>
              <div className="rounded-3xl overflow-hidden shadow-2xl h-[400px]">
                <img src="https://images.pexels.com/photos/7979605/pexels-photo-7979605.jpeg" alt="Applying for mortgage" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </section>

        {/* FAQ ACCORDION */}
        <section className="py-24 bg-zinc-50 border-t border-zinc-100">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-16">Mortgage Frequently Asked Questions</h2>
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-zinc-100">
              <AccordionItem title="Can I use a foreign income for a Nigerian mortgage?">
                Yes, our mortgage partners specialize in verifying foreign income sources for Nigerians in the diaspora. You will need to provide bank statements, pay slips, and credit reports from your country of residence.
              </AccordionItem>
              <AccordionItem title="What is the MREIF Home Loan?">
                The Mortgage Real Estate Investment Fund (MREIF) is a government-backed initiative managed by the Ministry of Finance Incorporated to provide affordable housing finance for Nigerians at home and abroad.
              </AccordionItem>
              <AccordionItem title="Do I need to be in Nigeria to sign the documents?">
                No. Most documents can be processed digitally or through registered legal power of attorney and verified at the nearest Nigerian embassy or high commission in your host country.
              </AccordionItem>
              <AccordionItem title="What happens if the property is not completed?">
                Our MREIF mortgages are tied to verified developers. We also ensure that funds are disbursed in tranches matched to construction milestones to protect your investment.
              </AccordionItem>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
