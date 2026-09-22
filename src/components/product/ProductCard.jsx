import React, { useState } from 'react';
import { Heart, ShoppingBag, Star, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProductCard({
  product,
  onProductClick,
  onAddToCart,
  onToggleWishlist,
  isWishlisted
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const displayImage = isHovered && product.images && product.images.length > 1
    ? product.images[1]
    : product.heroImage;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group bg-white border border-slate-200/90 hover:border-fuchsia-300/80 rounded-xs flex flex-col justify-between relative transition-all duration-300 tf-shadow-card hover:tf-shadow-card-hover overflow-hidden"
    >
      {/* Badges Container */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start pointer-events-none">
        {product.badge && (
          <span className="bg-gradient-to-r from-fuchsia-600 to-orange-500 text-white font-black text-[9px] uppercase tracking-wider px-2 py-0.5 shadow-sm rounded-xs">
            {product.badge}
          </span>
        )}
        {product.isAntiTarnish && (
          <span className="bg-white/90 backdrop-blur-sm border border-purple-200 text-purple-800 font-extrabold text-[8px] uppercase tracking-wider px-1.5 py-0.5 flex items-center gap-1 shadow-xs rounded-xs">
            <ShieldCheck className="w-2.5 h-2.5 text-purple-600" /> Anti-Tarnish
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggleWishlist(product.id);
        }}
        className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-md transition-all duration-200 ${
          isWishlisted
            ? 'bg-pink-50 text-pink-600 shadow-sm border border-pink-200'
            : 'bg-white/80 hover:bg-white text-slate-400 hover:text-pink-600 border border-slate-200/60 shadow-xs'
        }`}
        title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        aria-label="Wishlist toggle"
      >
        <Heart className={`w-4 h-4 transition-transform duration-200 ${isWishlisted ? 'fill-pink-600 scale-110' : 'group-hover:scale-105'}`} />
      </button>

      {/* Image Container with Smooth Zoom */}
      <div
        onClick={() => onProductClick(product)}
        className="relative aspect-[3/4] overflow-hidden bg-slate-100/70 cursor-pointer"
      >
        <img
          src={displayImage}
          alt={product.name}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-700 ease-out ${
            imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          } ${isHovered ? 'scale-105' : ''}`}
        />

        {/* Quick View Overlay on Hover */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center">
          <span className="text-[11px] font-black uppercase tracking-wider text-white bg-white/20 backdrop-blur-md px-3 py-1 rounded-xs border border-white/30">
            Quick View
          </span>
        </div>
      </div>

      {/* Product Meta Content */}
      <div className="p-4 flex-1 flex flex-col justify-between bg-white">
        <div>
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
            <span className="truncate max-w-[60%]">{product.brand || 'TakeFashion'}</span>
            <span className="text-fuchsia-600 truncate">{product.subcategory || product.category}</span>
          </div>

          <Link
            to={`/product/${product.id}`}
            className="text-xs md:text-sm font-black text-slate-900 hover:text-fuchsia-600 transition line-clamp-1 uppercase tracking-tight block"
            title={product.name}
          >
            {product.name}
          </Link>

          <p className="text-[11px] text-slate-500 font-medium line-clamp-1 mt-0.5">
            {product.tagline}
          </p>
        </div>

        {/* Rating, Price & Quick Add */}
        <div className="pt-3 mt-3 border-t border-slate-100/80 space-y-2.5">
          <div className="flex items-baseline justify-between gap-2">
            <div className="flex items-center gap-1 text-slate-800 text-[11px] font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-slate-400 text-[10px] font-normal">({product.reviewsCount})</span>
            </div>

            <div className="text-right flex items-baseline gap-1.5">
              {discountPercent > 0 && (
                <span className="text-[11px] text-slate-400 line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
              <span className="text-sm md:text-base font-black text-slate-950">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {discountPercent > 0 && (
                <span className="text-[10px] font-black text-emerald-600">
                  {discountPercent}% OFF
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="w-full py-2 bg-slate-900 hover:bg-gradient-to-r hover:from-fuchsia-600 hover:to-orange-500 text-white font-black text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-200 rounded-xs shadow-xs active:scale-[0.99]"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Add To Bag
          </button>
        </div>
      </div>
    </div>
  );
}
