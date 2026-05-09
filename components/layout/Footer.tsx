import Link from 'next/link';
import { ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-emerald-950 text-emerald-50 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <ShieldCheck className="h-8 w-8 text-brand-gold" />
              <span className="font-heading text-xl font-bold text-white tracking-tight">
                ATLANTIC <span className="text-brand-gold">PROPERTY</span>
              </span>
            </Link>
            <p className="text-emerald-200/80 text-sm leading-relaxed">
              Premium property advisory for Nigerians at home and in the diaspora. 
              Verified developers, transparent projects, and secure investment paths.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-lg font-semibold text-white mb-6">Invest</h3>
            <ul className="space-y-4 text-sm">
              <li><Link href="/nigeria" className="hover:text-brand-gold transition-colors">Nigeria Properties</Link></li>
              <li><Link href="/uk" className="hover:text-brand-gold transition-colors">UK Properties</Link></li>
              <li><Link href="/mortgage" className="hover:text-brand-gold transition-colors">Diaspora Mortgage</Link></li>
              <li><Link href="/prequalify" className="hover:text-brand-gold transition-colors">Eligibility Check</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading text-lg font-semibold text-white mb-6">Contact</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-brand-gold" />
                <span>+234 (0) 800 ATLANTIC</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-brand-gold" />
                <span>info@atlanticproperty.com</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-brand-gold mt-1" />
                <span>Lagos, Nigeria | London, UK</span>
              </li>
            </ul>
          </div>

          {/* Compliance */}
          <div>
            <h3 className="font-heading text-lg font-semibold text-white mb-6">Compliance</h3>
            <p className="text-xs text-emerald-200/60 leading-relaxed mb-4">
              Atlantic Property Partners is a property marketing and advisory firm. We are not a mortgage broker or financial advisor.
            </p>
            <p className="text-[10px] text-emerald-200/40">
              © 2026 Atlantic Property Partners. All rights reserved.
            </p>
          </div>
        </div>
        
        <div className="border-t border-emerald-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-emerald-200/40">
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-brand-gold transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-brand-gold transition-colors">Terms of Service</Link>
          </div>
          <div>
            Financial Conduct Authority (UK) Registered Partner
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
