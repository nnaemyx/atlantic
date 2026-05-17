'use client';

import { useState, memo } from 'react';
import Link from 'next/link';
import { MapPin, ChevronLeft, ChevronRight, BedDouble, Bath, ArrowRight, Building2, CheckCircle } from 'lucide-react';
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
    bedrooms?: number;
    bathrooms?: number;
    amenity1?: string;
    amenity2?: string;
    amenity3?: string;
    amenity4?: string;
    amenity5?: string;
    amenity6?: string;
  };
  hideDeveloperLink?: boolean;
}

const ListingCard = ({ listing, hideDeveloperLink }: ListingCardProps) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const images = listing.images?.length > 0 ? listing.images : [];
  const amenities = [
    listing.amenity1, listing.amenity2, listing.amenity3,
    listing.amenity4, listing.amenity5, listing.amenity6,
  ].filter(Boolean);

  const nextImage = () => setCurrentImage(p => (p === images.length - 1 ? 0 : p + 1));
  const prevImage = () => setCurrentImage(p => (p === 0 ? images.length - 1 : p - 1));

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-zinc-100 hover:shadow-lg transition-all duration-300 group">
      <div className="grid grid-cols-1 lg:grid-cols-2">

        {/* Image Carousel */}
        <div className="relative h-60 sm:h-72 lg:h-auto min-h-[260px] overflow-hidden">
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
                  transition={{ duration: 0.4 }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </AnimatePresence>
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Carousel controls */}
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
                  {/* Dot indicators */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentImage(i)}
                        className={`rounded-full transition-all duration-300 ${i === currentImage ? 'bg-brand-gold w-5 h-1.5' : 'bg-white/50 w-1.5 h-1.5'}`}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Price badge on image — visible on mobile */}
              <div className="absolute bottom-3 right-3 md:hidden bg-brand-emerald/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-xl">
                <p className="text-[10px] font-bold opacity-70 uppercase">From</p>
                <p className="font-black text-sm leading-tight">{listing.priceRange}</p>
              </div>
            </>
          ) : (
            <div className="w-full h-full bg-zinc-100 flex flex-col items-center justify-center gap-2 min-h-[260px]">
              <Building2 className="h-10 w-10 text-zinc-300" />
              <span className="text-zinc-400 text-sm">No image</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col p-5 sm:p-6 md:p-7">
          {/* Verified Badge */}
          <div className="flex items-center gap-2 text-brand-emerald mb-4">
            <CheckCircle className="h-4 w-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Verified Developer</span>
          </div>

          {/* Title + Developer */}
          <div className="mb-4">
            <h3 className="text-2xl font-bold text-emerald-950 mb-2 leading-snug">
              {listing.title}
            </h3>
            <Link
              href={`/nigeria/developer/${encodeURIComponent(listing.developer)}`}
              className="inline-block text-brand-gold font-heading text-lg hover:underline"
            >
              {listing.developer}
            </Link>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-zinc-500 mb-4 text-sm">
            <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="truncate">{listing.location}</span>
          </div>

          {/* Overview */}
          <div className="mb-6 flex-1">
            <p className={`text-zinc-600 text-sm leading-relaxed ${isExpanded ? '' : 'line-clamp-3'}`}>
              {listing.overview}
            </p>
            {listing.overview?.length > 150 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-brand-emerald text-xs font-bold mt-2 hover:underline"
              >
                {isExpanded ? 'Read less ↑' : 'Read more ↓'}
              </button>
            )}
          </div>

          {/* Amenities */}
          {amenities.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {amenities.map((a, i) => (
                <span key={i} className="bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-emerald-800">
                  {a}
                </span>
              ))}
            </div>
          )}

          {/* Footer: Price + CTAs */}
          <div className="border-t border-zinc-100 pt-4 mt-auto">
            {/* Bedrooms / Bathrooms row */}
            <div className="flex items-center gap-3 mb-3">
              <span className="flex items-center gap-1 text-zinc-500 text-xs font-semibold">
                <BedDouble className="h-3.5 w-3.5 text-brand-emerald" />
                {listing.bedrooms ?? 'N/A'} Bd
              </span>
              <span className="text-zinc-200">|</span>
              <span className="flex items-center gap-1 text-zinc-500 text-xs font-semibold">
                <Bath className="h-3.5 w-3.5 text-brand-emerald" />
                {listing.bathrooms ?? 'N/A'} Ba
              </span>
            </div>

            {/* Price & CTAs */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mt-2">
              <div>
                <p className="text-[10px] uppercase text-zinc-400 font-bold">Estimated Price</p>
                <p className="text-xl font-black text-brand-emerald">{listing.priceRange}</p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-row gap-2 w-full lg:w-auto">
                <Link
                  href={`/prequalify?project=${listing.id}`}
                  className="flex-1 lg:flex-none btn-primary text-center py-2.5 px-6 lg:px-8 whitespace-nowrap"
                >
                  Enquire Now
                </Link>
                {!hideDeveloperLink && (
                  <Link
                    href={`/nigeria/developer/${encodeURIComponent(listing.developer)}`}
                    className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 border border-brand-emerald/30 text-brand-emerald hover:bg-emerald-50 px-4 lg:px-6 py-2.5 rounded-lg font-bold transition-colors whitespace-nowrap"
                  >
                    Developer <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(ListingCard);
