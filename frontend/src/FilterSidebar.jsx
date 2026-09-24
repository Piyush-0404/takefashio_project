import React from 'react';
import { SlidersHorizontal, RotateCcw, Check, Sparkles } from 'lucide-react';

export default function FilterSidebar({
  categories = [],
  selectedCategory,
  onSelectCategory,
  maxPrice,
  setMaxPrice,
  minPrice = 500,
  priceLimit = 6500,
  sortBy,
  setSortBy,
  minRating,
  setMinRating,
  onReset
}) {
  return (
    <div className="bg-white border border-slate-200/90 rounded-xs p-6 space-y-7 sticky top-24 tf-shadow-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-fuchsia-600" />
          Filter & Refine
        </h3>
        <button
          type="button"
          onClick={onReset}
          className="text-[11px] font-bold uppercase tracking-wider text-slate-400 hover:text-fuchsia-600 flex items-center gap-1 transition"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      {/* Sort selection */}
      <div>
        <label className="text-[11px] font-black uppercase tracking-widest text-slate-800 block mb-2">
          Sort By
        </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 text-slate-900 font-semibold text-xs px-3 py-2.5 rounded-xs focus:outline-none focus:border-fuchsia-500 transition cursor-pointer"
        >
          <option value="featured">Featured Curations</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>

      {/* Dynamic Subcategories if available */}
      {categories.length > 0 && (
        <div>
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-800 block mb-2.5">
            Category Edit
          </label>
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => onSelectCategory('all')}
              className={`w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider transition rounded-xs flex items-center justify-between ${
                selectedCategory === 'all'
                  ? 'bg-slate-900 text-white font-black'
                  : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900'
              }`}
            >
              <span>All Pieces</span>
              {selectedCategory === 'all' && <Check className="w-3.5 h-3.5 text-orange-400" />}
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => onSelectCategory(cat)}
                className={`w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider transition rounded-xs flex items-center justify-between ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white font-black'
                    : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900'
                }`}
              >
                <span>{cat}</span>
                {selectedCategory === cat && <Check className="w-3.5 h-3.5 text-orange-400" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Price Slider */}
      <div>
        <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-slate-800 mb-2">
          <span>Max Price</span>
          <span className="text-fuchsia-700 font-black">₹{maxPrice.toLocaleString('en-IN')}</span>
        </div>
        <input
          type="range"
          min={minPrice}
          max={priceLimit}
          step="100"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-fuchsia-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
        />
        <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-1.5">
          <span>₹{minPrice.toLocaleString('en-IN')}</span>
          <span>₹{priceLimit.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Rating Filter */}
      {setMinRating && (
        <div>
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-800 block mb-2">
            Minimum Rating
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { label: 'All', val: 0 },
              { label: '4.5 ★', val: 4.5 },
              { label: '4.8 ★', val: 4.8 }
            ].map((r) => (
              <button
                key={r.val}
                type="button"
                onClick={() => setMinRating(r.val)}
                className={`py-1.5 px-2 text-[10px] font-black uppercase rounded-xs border transition ${
                  minRating === r.val
                    ? 'bg-fuchsia-50 border-fuchsia-600 text-fuchsia-700'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quality Guarantee Mini Card */}
      <div className="bg-gradient-to-br from-fuchsia-50/60 to-orange-50/60 p-3.5 border border-fuchsia-200/50 rounded-xs">
        <p className="text-[10px] font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-fuchsia-600" />
          The TakeFashion Promise
        </p>
        <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
          100% genuine designs, 7-day seamless exchange, and assured quality standards.
        </p>
      </div>
    </div>
  );
}
