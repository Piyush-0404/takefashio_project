import React, { useState } from 'react';
import { X, Star, Heart, ShoppingBag, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProductDetailModal({ product, onClose, onAddToCart, onToggleWishlist, isWishlisted }) {
  const [activeImg, setActiveImg] = useState(product?.heroImage || '');
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || 'M');
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState(null);
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const checkPincode = (e) => {
    e.preventDefault();
    if (pincode.length === 6 && /^\d+$/.test(pincode)) {
      setPincodeStatus({
        success: true,
        message: "Delivery available in 2-4 business days with TakeFashion Express Courier."
      });
    } else {
      setPincodeStatus({
        success: false,
        message: "Please enter a valid 6-digit Indian PIN code."
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex justify-center items-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 w-full max-w-4xl my-8 relative shadow-2xl rounded-xs overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-slate-100/90 hover:bg-slate-200 text-slate-700 p-2 rounded-full transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-6 md:p-8 max-h-[85vh] overflow-y-auto">
          
          {/* Left: Images */}
          <div className="md:col-span-6 space-y-4">
            <div className="relative aspect-[3/4] bg-slate-100 rounded-xs overflow-hidden border border-slate-200">
              <img
                src={activeImg || product.heroImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.badge && (
                <span className="absolute top-3 left-3 bg-gradient-to-r from-fuchsia-600 to-orange-500 text-white font-black text-[10px] px-2.5 py-1 uppercase tracking-wider rounded-xs shadow-sm">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {product.images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImg(imgUrl)}
                    className={`w-16 h-20 rounded-xs border-2 shrink-0 overflow-hidden transition ${
                      (activeImg || product.heroImage) === imgUrl ? 'border-fuchsia-600' : 'border-slate-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Meta & Actions */}
          <div className="md:col-span-6 flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-fuchsia-600 mb-1">
                <span>{product.brand || 'TakeFashion'}</span>
                <span className="text-slate-400 font-bold">{product.subcategory || product.category}</span>
              </div>

              <h2 className="text-xl md:text-2xl font-black text-slate-950 uppercase tracking-tight leading-snug">
                {product.name}
              </h2>

              <p className="text-xs text-slate-500 font-medium mt-1">
                {product.tagline}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-2.5">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-black text-slate-900">{product.rating}</span>
                <span className="text-xs text-slate-400">({product.reviewsCount} reviews)</span>
              </div>

              {/* Price Display */}
              <div className="mt-3.5 flex items-baseline gap-2.5 border-y border-slate-100 py-3">
                <span className="text-2xl font-black text-slate-950">₹{product.price.toLocaleString('en-IN')}</span>
                {discountPercent > 0 && (
                  <>
                    <span className="text-xs text-slate-400 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                    <span className="text-[11px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-xs">
                      Save {discountPercent}%
                    </span>
                  </>
                )}
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mt-3">
                {product.description}
              </p>

              {/* Size Selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mt-4">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-900 block mb-1.5">
                    Size: {selectedSize}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-9 h-8 px-2.5 text-xs font-bold uppercase rounded-xs border transition ${
                          selectedSize === size
                            ? 'bg-slate-950 text-white border-slate-950'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Delivery check */}
              <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-xs">
                <label className="text-[11px] font-black uppercase text-slate-800 tracking-wider flex items-center gap-1.5 mb-1.5">
                  <MapPin className="w-3.5 h-3.5 text-fuchsia-600" /> Check PIN Code Delivery
                </label>
                <form onSubmit={checkPincode} className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="e.g. 110001"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="bg-white border border-slate-300 text-slate-900 px-3 py-1.5 text-xs rounded-xs font-bold w-full focus:outline-none focus:border-fuchsia-500"
                  />
                  <button
                    type="submit"
                    className="bg-slate-900 hover:bg-fuchsia-600 text-white font-black text-xs uppercase px-3 py-1.5 rounded-xs transition shrink-0"
                  >
                    Check
                  </button>
                </form>
                {pincodeStatus && (
                  <p className={`text-[11px] font-bold mt-1.5 ${pincodeStatus.success ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {pincodeStatus.message}
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="flex gap-3">
                <div className="flex items-center border border-slate-300 rounded-xs bg-white text-slate-900">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-2.5 py-2 text-sm font-black hover:bg-slate-100"
                  >
                    -
                  </button>
                  <span className="px-3 font-black text-xs">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-2.5 py-2 text-sm font-black hover:bg-slate-100"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => {
                    for (let i = 0; i < quantity; i++) {
                      onAddToCart(product);
                    }
                    onClose();
                  }}
                  className="flex-1 py-2.5 tf-btn-primary font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 rounded-xs shadow-sm"
                >
                  <ShoppingBag className="w-4 h-4" /> Add To Bag
                </button>

                <button
                  onClick={() => onToggleWishlist(product.id)}
                  className={`p-2.5 border rounded-xs transition ${
                    isWishlisted ? 'border-pink-300 bg-pink-50 text-pink-600' : 'border-slate-300 text-slate-600 hover:border-pink-300'
                  }`}
                  title="Toggle wishlist"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-pink-600' : ''}`} />
                </button>
              </div>

              <div className="text-center pt-1">
                <Link
                  to={`/product/${product.id}`}
                  onClick={onClose}
                  className="text-[11px] font-black uppercase tracking-wider text-fuchsia-600 hover:text-fuchsia-800 underline underline-offset-4"
                >
                  View Full Product Details Page →
                </Link>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
