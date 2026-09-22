import React from 'react';
import { Search, X, ArrowRight } from 'lucide-react';

export default function SearchModal({
  isOpen,
  onClose,
  searchQuery,
  setSearchQuery,
  products = [],
  onSelectProduct
}) {
  if (!isOpen) return null;

  const query = searchQuery.trim().toLowerCase();
  const results = query === ''
    ? []
    : products.filter((p) =>
        p.name.toLowerCase().includes(query) ||
        (p.category && p.category.toLowerCase().includes(query)) ||
        (p.subcategory && p.subcategory.toLowerCase().includes(query)) ||
        (p.audience && p.audience.toLowerCase().includes(query)) ||
        (p.tagline && p.tagline.toLowerCase().includes(query))
      );

  const popularTags = [
    'Oversized Tee',
    'Oxford Shirt',
    'Slip Dress',
    'Chanderi Kurti',
    'Denim',
    'Sneakers',
    'Leather Bag',
    'Jhumkas'
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex justify-center items-start pt-16 px-4 animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-white border border-slate-200 shadow-2xl rounded-xs p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 transition p-1.5 rounded-full hover:bg-slate-100"
          aria-label="Close search"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xs font-black uppercase tracking-wider text-fuchsia-600 mb-3 flex items-center gap-2">
          <Search className="w-4 h-4" /> Discover TakeFashion
        </h3>

        {/* Search Input */}
        <div className="relative mb-5">
          <input
            type="text"
            placeholder="Search dresses, shirts, sneakers, jewellery, bags, denim..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
            className="w-full bg-slate-50 border border-slate-300 text-slate-950 px-4 py-3 text-sm md:text-base rounded-xs focus:outline-none focus:border-fuchsia-600 focus:bg-white font-medium placeholder-slate-400 transition"
          />
        </div>

        {/* Results */}
        {query !== '' && (
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-3">
              <span>Found {results.length} pieces</span>
              {results.length > 0 && <span>Instant results</span>}
            </div>

            {results.length === 0 ? (
              <p className="text-xs text-slate-500 py-8 text-center border border-dashed border-slate-200 rounded-xs">
                No items match "{searchQuery}". Try searching for popular styles like "Shirt", "Dress", "Denim", or "Jhumkas".
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[55vh] overflow-y-auto pr-1">
                {results.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      onSelectProduct(product);
                      onClose();
                    }}
                    className="flex gap-3.5 p-3 bg-slate-50 hover:bg-fuchsia-50/50 border border-slate-200/80 hover:border-fuchsia-300 rounded-xs cursor-pointer group transition"
                  >
                    <img
                      src={product.heroImage}
                      alt={product.name}
                      className="w-16 h-20 object-cover bg-slate-200 rounded-xs shrink-0"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-fuchsia-600">
                          {product.audience || 'Fashion'}
                        </span>
                        <h4 className="text-xs font-black text-slate-900 group-hover:text-fuchsia-600 line-clamp-1 uppercase">
                          {product.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{product.tagline}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-950">₹{product.price.toLocaleString('en-IN')}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-fuchsia-600 group-hover:translate-x-0.5 transition" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Popular Tags */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Popular:</span>
          {popularTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSearchQuery(tag)}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-700 text-[11px] font-bold uppercase rounded-xs transition"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
