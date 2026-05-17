'use client';

import { useState, useEffect, useMemo } from 'react';
import ListingCard from './ListingCard';
import { Search, ChevronLeft, ChevronRight, X, SlidersHorizontal } from 'lucide-react';

interface PropertyListViewProps {
  listings: any[];
  market: string;
  hideDeveloperLink?: boolean;
  hideSearch?: boolean;
}

export default function PropertyListView({ listings, market, hideDeveloperLink, hideSearch }: PropertyListViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const filteredListings = useMemo(() =>
    listings.filter((listing) => {
      const q = searchQuery.toLowerCase();
      return (
        (listing.title && listing.title.toLowerCase().includes(q)) ||
        (listing.location && listing.location.toLowerCase().includes(q)) ||
        (listing.developer && listing.developer.toLowerCase().includes(q))
      );
    }),
    [listings, searchQuery]
  );

  const totalPages = useMemo(() => Math.max(1, Math.ceil(filteredListings.length / itemsPerPage)), [filteredListings.length, itemsPerPage]);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedListings = useMemo(() => filteredListings.slice(startIndex, startIndex + itemsPerPage), [filteredListings, startIndex, itemsPerPage]);

  const getPageNumbers = useMemo(() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | '...')[] = [1];
    if (currentPage > 3) pages.push('...');
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push('...');
    pages.push(totalPages);
    return pages;
  }, [totalPages, currentPage]);

  return (
    <div className="space-y-6 md:space-y-10">
      {/* Search Bar */}
      {!hideSearch && (
        <div className="relative max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-zinc-400" />
          </div>
          <input
            type="text"
            className="w-full pl-11 pr-10 py-3.5 md:py-4 rounded-2xl border border-zinc-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-emerald/30 focus:border-brand-emerald shadow-sm text-sm md:text-base"
            placeholder={`Search by name, location or developer...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-4 flex items-center text-zinc-400 hover:text-zinc-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      {/* Results count */}
      {!hideSearch && searchQuery && (
        <p className="text-sm text-zinc-500 text-center">
          {filteredListings.length === 0
            ? 'No results found'
            : `${filteredListings.length} propert${filteredListings.length === 1 ? 'y' : 'ies'} found`}
        </p>
      )}

      {filteredListings.length > 0 ? (
        <>
          {/* Listings */}
          <div className="space-y-5 md:space-y-8">
            {paginatedListings.map((listing: any) => (
              <ListingCard
                key={listing._id?.toString() || listing.listingId}
                listing={{
                  id: listing.listingId || listing._id?.toString(),
                  title: listing.title,
                  developer: listing.developer,
                  location: listing.location,
                  priceRange: listing.priceRange,
                  images: listing.images?.length > 0 ? listing.images : (listing.image ? [listing.image] : []),
                  overview: listing.overview,
                  bedrooms: listing.beds,
                  bathrooms: listing.rooms,
                  amenity1: listing.amenity1,
                  amenity2: listing.amenity2,
                  amenity3: listing.amenity3,
                  amenity4: listing.amenity4,
                  amenity5: listing.amenity5,
                  amenity6: listing.amenity6,
                }}
                hideDeveloperLink={hideDeveloperLink}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex flex-col items-center gap-3 pt-6 border-t border-zinc-100">
            {/* Page info */}
            <p className="text-xs text-zinc-400 font-medium">
              Page {currentPage} of {totalPages} &nbsp;·&nbsp; {filteredListings.length} listing{filteredListings.length !== 1 ? 's' : ''}
            </p>

            <div className="flex items-center gap-1.5">
              {/* Prev */}
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-zinc-200 text-zinc-500 hover:bg-zinc-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {/* Page numbers */}
              <div className="flex gap-1">
                {getPageNumbers.map((page, idx) =>
                  page === '...' ? (
                    <span key={`ellipsis-${idx}`} className="w-9 h-9 flex items-center justify-center text-zinc-400 text-sm">
                      …
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page as number)}
                      className={`w-9 h-9 rounded-xl font-bold text-sm transition-all ${
                        currentPage === page
                          ? 'bg-brand-emerald text-white shadow-md shadow-brand-emerald/20'
                          : 'text-zinc-500 hover:bg-zinc-100'
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>

              {/* Next */}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-zinc-200 text-zinc-500 hover:bg-zinc-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-16 sm:py-24 bg-white rounded-2xl border border-zinc-100">
          <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-zinc-100">
            <SlidersHorizontal className="h-7 w-7 text-zinc-300" />
          </div>
          <h3 className="font-bold text-zinc-700 mb-2">No properties match your search</h3>
          <p className="text-zinc-400 text-sm mb-5">Try a different keyword or clear your filter.</p>
          <button
            onClick={() => setSearchQuery('')}
            className="inline-flex items-center gap-2 text-brand-emerald font-bold text-sm hover:underline"
          >
            <X className="h-3.5 w-3.5" /> Clear search
          </button>
        </div>
      )}
    </div>
  );
}
