import React from 'react';
import { Heart, ShoppingBag, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ALL_PRODUCTS } from '../catalog';
import ProductCard from '../components/product/ProductCard';

export default function WishlistPage({
  wishlistIds = [],
  onProductClick,
  onAddToCart,
  onToggleWishlist
}) {
  const wishlistedProducts = ALL_PRODUCTS.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="min-h-screen bg-[#fffafc] py-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Wishlist Header */}
        <div className="border-b border-slate-200 pb-6 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-fuchsia-600">
              Personal Collection
            </span>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-slate-950 mt-1">
              My Wishlist ({wishlistedProducts.length})
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Your handpicked favourites saved for easy reference and checkout.
            </p>
          </div>

          {wishlistedProducts.length > 0 && (
            <button
              onClick={() => {
                wishlistedProducts.forEach((p) => onAddToCart(p));
              }}
              className="px-5 py-2.5 bg-slate-900 hover:bg-fuchsia-600 text-white font-black text-xs uppercase tracking-wider rounded-xs transition flex items-center gap-2 self-start sm:self-auto"
            >
              <ShoppingBag className="w-4 h-4" /> Move All to Bag
            </button>
          )}
        </div>

        {/* Wishlist Content */}
        {wishlistedProducts.length === 0 ? (
          <div className="bg-white border border-slate-200/90 rounded-xs p-16 text-center max-w-lg mx-auto shadow-xs">
            <div className="w-16 h-16 bg-pink-50 text-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 fill-pink-100" />
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight text-slate-950 mb-2">
              Your Wishlist Is Waiting
            </h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed max-w-sm mx-auto">
              Save pieces you love by tapping the heart icon as you explore our fashion and lifestyle collections.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 tf-btn-primary font-black text-xs uppercase tracking-wider rounded-xs shadow-sm"
            >
              <Sparkles className="w-4 h-4" /> Discover Collections
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {wishlistedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onProductClick={onProductClick}
                onAddToCart={onAddToCart}
                onToggleWishlist={onToggleWishlist}
                isWishlisted={true}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
