'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Only on the homepage do we allow the transparent/over-hero effect.
  // On all other pages the navbar is always solid from the top.
  const isHomePage = pathname === '/';
  const solidNav = isScrolled || !isHomePage;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // About moved to last position before Enquire Now
  const navLinks = [
    { name: 'Nigeria Properties', href: '/nigeria' },
    { name: 'UK Properties', href: '/uk' },
    { name: 'Mortgage', href: '/mortgage' },
    { name: 'Insights', href: '/blog' },
    { name: 'About', href: '/about' },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        solidNav ? 'bg-white/95 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2.5">
              <Home className="h-5 w-5 md:h-6 md:w-6 text-brand-emerald flex-shrink-0" />
              <div className="flex flex-col leading-none">
                <span className={`font-heading text-base md:text-lg font-bold tracking-tight ${solidNav ? 'text-brand-emerald' : 'text-white drop-shadow'}`}>
                  My Property <span className="text-brand-gold">Centre</span>
                </span>
                <span className={`text-[9px] tracking-wide font-medium hidden sm:block ${solidNav ? 'text-zinc-400' : 'text-white/60'}`}>
                  by Atlantic Property Partners
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-brand-gold ${
                  pathname === link.href
                    ? 'text-brand-gold'
                    : solidNav ? 'text-zinc-700' : 'text-white/90 drop-shadow'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link href="/prequalify" className="btn-primary py-2 px-5 text-sm">
              Enquire Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 ${solidNav ? 'text-zinc-700' : 'text-white'} hover:text-brand-gold`}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-zinc-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block px-3 py-3 text-base font-medium text-zinc-700 hover:text-brand-gold hover:bg-zinc-50 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4">
                <Link
                  href="/prequalify"
                  className="block w-full text-center btn-primary"
                  onClick={() => setIsOpen(false)}
                >
                  Enquire Now
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
