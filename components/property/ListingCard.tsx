'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapPin, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ListingCardProps {
  listing: {
    id: string;
    title: string;
    developer: string;
    location: string;
    priceRange: string;
    images: string[];
    overview: string;
  };
}

const ListingCard = ({ listing }: ListingCardProps) => {
  const [currentImage, setCurrentImage] = useState(0);

  const nextImage = () => {
    setCurrentImage((prev) => (prev === listing.images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev === 0 ? listing.images.length - 1 : prev - 1));
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-zinc-100 hover:shadow-md transition-shadow group">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Image Carousel */}
        <div className="relative h-[300px] lg:h-auto overflow-hidden">
          {listing.images && listing.images.length > 0 ? (
            <>
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImage}
                  src={listing.images[currentImage]}
                  alt={listing.title}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              {listing.images.length > 1 && (
                <>
                  <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/40 transition-colors">
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/40 transition-colors">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  <div className="absolute bottom-4 left-4 flex gap-1">
                    {listing.images.map((_, i) => (
                      <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentImage ? 'bg-brand-gold w-4' : 'bg-white/50'}`} />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full bg-zinc-100 flex items-center justify-center min-h-[200px]">
              <span className="text-zinc-400 text-sm">No image available</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-brand-emerald">
                <CheckCircle className="h-4 w-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Verified Developer</span>
              </div>
              {listing.id && (
                <span className="text-[10px] font-mono font-bold text-zinc-400 bg-zinc-50 px-2 py-0.5 rounded">{listing.id}</span>
              )}
            </div>
            
            <h3 className="text-2xl font-bold mb-2">{listing.title}</h3>
            <p className="text-brand-gold font-heading text-lg mb-4">{listing.developer}</p>
            
            <div className="flex items-center gap-2 text-zinc-500 mb-6 text-sm">
              <MapPin className="h-4 w-4" />
              {listing.location}
            </div>
            
            <p className="text-zinc-600 text-sm leading-relaxed mb-8 line-clamp-3">
              {listing.overview}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-zinc-50 pt-6">
            <div>
              <p className="text-[10px] uppercase text-zinc-400 font-bold mb-1">Estimated Price</p>
              <p className="text-xl font-bold text-brand-emerald">{listing.priceRange}</p>
            </div>
            <Link href={`/prequalify?project=${listing.id}`} className="btn-primary w-full sm:w-auto text-center py-2.5 px-8">
              Enquire Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
