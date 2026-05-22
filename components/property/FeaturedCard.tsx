'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapPin, ChevronLeft, ChevronRight, BedDouble, Bath, Building2, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FeaturedCardProps {
  listing: {
    id: string;
    title: string;
    developer: string;
    location: string;
    priceRange: string;
    images: string[];
    overview?: string;
    beds?: number;
    rooms?: number;
    amenity1?: string;
    amenity2?: string;
    amenity3?: string;
    amenity4?: string;
    amenity5?: string;
    amenity6?: string;
    type: string; // 'Nigeria' | 'UK'
  };
}

export default function FeaturedCard({ listing }: FeaturedCardProps) {
  const [currentImage, setCurrentImage] = useState(0);

  const images = listing.images?.length > 0 ? listing.images : [];
  const amenities = [
    listing.amenity1, listing.amenity2, listing.amenity3,
    listing.amenity4, listing.amenity5, listing.amenity6,
  ].filter(Boolean);

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImage(p => (p === images.length - 1 ? 0 : p + 1));
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImage(p => (p === 0 ? images.length - 1 : p - 1));
  };

  const isNigeria = listing.type === 'Nigeria';

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-zinc-100 shadow-sm hover:shadow-xl transition-all duration-300 flex-shrink-0 w-[80vw] sm:w-[60vw] md:w-auto snap-start flex flex-col h-full">
      {/* Image Carousel */}
      <div className="relative h-52 sm:h-56 md:h-60 overflow-hidden bg-zinc-100 flex-shrink-0">
        {images.length > 0 ? (
          <>
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImage}
                src={images[currentImage]}
                alt={listing.title}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Carousel Controls */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/30 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/50 transition-colors z-10"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/30 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/50 transition-colors z-10"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                {/* Dots */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setCurrentImage(i);
                      }}
                      className={`rounded-full transition-all duration-300 ${i === currentImage ? 'bg-brand-gold w-5 h-1.5' : 'bg-white/50 w-1.5 h-1.5'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-zinc-300">
            <Building2 className="h-8 w-8" />
            <span className="text-xs">No image</span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Verified Badge */}
        <div className="flex items-center gap-1.5 text-brand-emerald mb-3 text-[10px] font-bold uppercase tracking-widest flex-shrink-0">
          <CheckCircle className="h-3.5 w-3.5" />
          <span>Verified Developer</span>
        </div>

        {/* Title & Developer link */}
        <div className="mb-2 flex-shrink-0">
          <h3 className="text-lg font-bold text-emerald-950 line-clamp-1 leading-snug">
            {listing.title}
          </h3>
          <span className="text-xs text-brand-gold font-heading font-semibold">
            {listing.developer}
          </span>
        </div>
        
        <div className="flex items-center gap-1.5 text-zinc-500 text-xs mb-3 flex-shrink-0">
          <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-zinc-400" />
          <span className="truncate">{listing.location}</span>
        </div>

        {listing.overview && (
          <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2 mb-3.5 flex-grow-0 min-h-[32px]">{listing.overview}</p>
        )}

        {/* Beds / Baths Row */}
        {(listing.beds || listing.rooms) && (
          <div className="flex items-center gap-2 mb-3 text-xs text-zinc-500 font-semibold flex-shrink-0">
            {listing.beds && (
              <span className="flex items-center gap-1">
                <BedDouble className="h-3.5 w-3.5 text-brand-emerald" />
                {listing.beds} Beds
              </span>
            )}
            {listing.beds && listing.rooms && <span className="text-zinc-200">|</span>}
            {listing.rooms && (
              <span className="flex items-center gap-1">
                <Bath className="h-3.5 w-3.5 text-brand-emerald" />
                {listing.rooms} Baths
              </span>
            )}
          </div>
        )}

        {/* Amenities tags */}
        {amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4 flex-shrink-0">
            {amenities.map((a, i) => (
              <span key={i} className="bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md text-[10px] font-semibold text-emerald-800">
                {a}
              </span>
            ))}
          </div>
        )}

        {/* Price & Action Row */}
        <div className="flex justify-between items-center border-t border-zinc-100 pt-3.5 mt-auto flex-shrink-0">
          <div>
            <p className="text-[9px] uppercase text-zinc-400 font-bold tracking-wider">Estimated Price</p>
            <p className="font-extrabold text-brand-emerald text-sm leading-tight">{listing.priceRange}</p>
          </div>
          <Link 
            href={isNigeria ? `/prequalify?project=${listing.id}` : `/prequalify?market=UK&project=${listing.id}`} 
            className="btn-gold py-1.5 px-4 rounded-lg text-xs font-bold hover:shadow-md transition-shadow"
          >
            Enquire
          </Link>
        </div>
      </div>
    </div>
  );
}
