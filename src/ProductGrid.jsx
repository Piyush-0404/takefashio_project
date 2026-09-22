import React from 'react';
import ProductCard from './components/product/ProductCard';
import { ShoppingBag, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProductGrid({ 
  products = [], 
  onProductClick, 
  onAddToCart, 
  onToggleWishlist,
  wishlistIds = [],
  isLoading = false
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white border border-slate-200/80 p-4 space-y-4 animate-pulse rounded-xs">
            <div className="aspect-[3/4] bg-slate-200/60 rounded-xs" />
            <div className="h-4 bg-slate-200/60 rounded-xs w-3/4" />
            <div className="h-3 bg-slate-200/40 rounded-xs w-1/2" />
            <div className="h-8 bg-slate-200/60 rounded-xs w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white border border-slate-200/80 p-12 text-center rounded-xs shadow-xs max-w-lg mx-auto my-6">
        <div className="w-14 h-14 bg-fuchsia-50 text-fuchsia-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-black uppercase tracking-wide text-slate-950 mb-2">
          No Pieces Found
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6 leading-relaxed">
          We couldn't find items matching your selected criteria. Try adjusting your filters or explore other edits.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-fuchsia-600 text-white font-black text-xs uppercase tracking-wider transition rounded-xs"
        >
          <Sparkles className="w-3.5 h-3.5" /> Explore All Fashion
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onProductClick={onProductClick}
          onAddToCart={onAddToCart}
          onToggleWishlist={onToggleWishlist}
          isWishlisted={wishlistIds.includes(product.id)}
        />
      ))}
    </div>
  );
}
