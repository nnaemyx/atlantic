'use client';

import Link from 'next/link';
import { ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
);

const LinkedInIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);
import { useEffect, useState } from 'react';

const Footer = ({ initialCms = {} }: { initialCms?: Record<string, string> }) => {
  const [cms, setCms] = useState<Record<string, string>>(initialCms);

  useEffect(() => {
    // If not provided by parent, fetch it
    if (Object.keys(initialCms).length === 0) {
      fetch('/api/site-content')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            const map: Record<string, string> = {};
            data.forEach((item: any) => { map[item.key] = item.value; });
            setCms(map);
          }
        })
        .catch(() => {});
    }
  }, [initialCms]);

  return (
    <footer className="bg-emerald-950 text-emerald-50 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <ShieldCheck className="h-8 w-8 text-brand-gold" />
              <span className="font-heading text-xl font-bold text-white tracking-tight">
                {cms['global.company.name'] ? cms['global.company.name'].split(' ')[0] : 'ATLANTIC'} <span className="text-brand-gold">{cms['global.company.name'] ? cms['global.company.name'].split(' ').slice(1).join(' ') : 'PROPERTY'}</span>
              </span>
            </Link>
            <p className="text-emerald-200/80 text-sm leading-relaxed">
              {cms['global.company.tagline'] || 'Premium property advisory for Nigerians at home and in the diaspora. Verified developers, transparent projects, and secure investment paths.'}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-lg font-semibold text-white mb-6">Invest</h3>
            <ul className="space-y-4 text-sm">
              <li><Link href="/about" className="hover:text-brand-gold transition-colors">About Us</Link></li>
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
                <span>{cms['global.contact.phone'] || '+234 (0) 800 ATLANTIC'}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-brand-gold" />
                <span>{cms['global.contact.email'] || 'info@atlanticproperty.com'}</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-brand-gold mt-1" />
                <span>{cms['global.contact.address'] || 'Lagos, Nigeria | London, UK'}</span>
              </li>
            </ul>
          </div>

          {/* Compliance */}
          <div>
            <h3 className="font-heading text-lg font-semibold text-white mb-6">Compliance</h3>
            <p className="text-xs text-emerald-200/60 leading-relaxed mb-4">
              {cms['global.company.name'] || 'Atlantic Property Partners'} is a property marketing and advisory firm. We are not a mortgage broker or financial advisor.
            </p>
            <p className="text-[10px] text-emerald-200/40">
              © {new Date().getFullYear()} {cms['global.company.name'] || 'Atlantic Property Partners'}. All rights reserved.
            </p>
          </div>
        </div>
        
        <div className="border-t border-emerald-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-emerald-200/40">
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-brand-gold transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-brand-gold transition-colors">Terms of Service</Link>
          </div>
          <div className="flex gap-5 items-center">
            {cms['global.social.tiktok'] && (
              <a href={cms['global.social.tiktok']} target="_blank" rel="noreferrer" className="text-emerald-200/60 hover:text-brand-gold transition-colors" aria-label="TikTok">
                <TikTokIcon className="h-5 w-5" />
              </a>
            )}
            {cms['global.social.instagram'] && (
              <a href={cms['global.social.instagram']} target="_blank" rel="noreferrer" className="text-emerald-200/60 hover:text-brand-gold transition-colors" aria-label="Instagram">
                <InstagramIcon className="h-5 w-5" />
              </a>
            )}
            {cms['global.social.facebook'] && (
              <a href={cms['global.social.facebook']} target="_blank" rel="noreferrer" className="text-emerald-200/60 hover:text-brand-gold transition-colors" aria-label="Facebook">
                <FacebookIcon className="h-5 w-5" />
              </a>
            )}
            {cms['global.social.twitter'] && (
              <a href={cms['global.social.twitter']} target="_blank" rel="noreferrer" className="text-emerald-200/60 hover:text-brand-gold transition-colors" aria-label="Twitter">
                <TwitterIcon className="h-5 w-5" />
              </a>
            )}
            {cms['global.social.linkedin'] && (
              <a href={cms['global.social.linkedin']} target="_blank" rel="noreferrer" className="text-emerald-200/60 hover:text-brand-gold transition-colors" aria-label="LinkedIn">
                <LinkedInIcon className="h-5 w-5" />
              </a>
            )}
            {cms['global.social.whatsapp'] && (
              <a href={cms['global.social.whatsapp']} target="_blank" rel="noreferrer" className="text-emerald-200/60 hover:text-brand-gold transition-colors text-xs font-bold uppercase tracking-widest border border-emerald-200/20 px-3 py-1.5 rounded-full hover:border-brand-gold">
                WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
