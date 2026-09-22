import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Heart, ShoppingBag, Truck, RefreshCw, ShieldCheck, Check, ChevronRight, MapPin } from 'lucide-react';
import { ALL_PRODUCTS } from '../catalog';
import ProductCard from '../components/product/ProductCard';

export default function ProductDetailPage({ onAddToCart, onToggleWishlist, wishlistIds = [], onProductClick }) {
  const { id } = useParams();
  const product = ALL_PRODUCTS.find((p) => p.id === id) || ALL_PRODUCTS[0];

  const [activeImage, setActiveImage] = useState(product.images?.[0] || product.heroImage);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || 'M');
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('');
  const [deliveryStatus, setDeliveryStatus] = useState(null);

  const isWishlisted = wishlistIds.includes(product.id);
  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handlePincodeCheck = (e) => {
    e.preventDefault();
    if (pincode.length === 6 && /^\d+$/.test(pincode)) {
      setDeliveryStatus({
        valid: true,
        message: 'Delivery available in 2-4 business days. Free courier dispatch!'
      });
    } else {
      setDeliveryStatus({
        valid: false,
        message: 'Please enter a valid 6-digit Indian PIN code.'
      });
    }
  };

  // Related products from same audience/department
  const relatedProducts = ALL_PRODUCTS.filter(
    (p) => p.id !== product.id && (p.department === product.department || p.audience === product.audience)
  ).slice(0, 4);

  return (
    <div className="min-h-screen bg-[#fffafc] py-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mb-8 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-fuchsia-600 transition">Home</Link>
          <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
          <Link to={`/${product.audience?.toLowerCase() || 'shop'}`} className="hover:text-fuchsia-600 transition">
            {product.audience || 'Collection'}
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
          <span className="text-slate-900 font-black truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Product Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT: Gallery */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4 sticky top-24">
            {/* Thumbnail Row / Column */}
            {product.images && product.images.length > 1 && (
              <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto max-h-[580px] shrink-0 scrollbar-none">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-16 h-20 md:w-20 md:h-24 rounded-xs overflow-hidden border-2 transition ${
                      activeImage === img ? 'border-fuchsia-600 shadow-sm' : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Main Stage Image */}
            <div className="flex-1 relative aspect-[3/4] bg-slate-100 rounded-xs overflow-hidden border border-slate-200/90 tf-shadow-card">
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.badge && (
                <span className="absolute top-4 left-4 bg-gradient-to-r from-fuchsia-600 to-orange-500 text-white text-xs font-black px-3 py-1 uppercase tracking-wider rounded-xs shadow-md">
                  {product.badge}
                </span>
              )}
            </div>
          </div>

          {/* RIGHT: Product Meta & Purchase Controls */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-fuchsia-600 mb-1.5">
                <span>{product.brand || 'TakeFashion'}</span>
                <span className="text-slate-400 font-bold">{product.subcategory || product.category}</span>
              </div>

              <h1 className="text-2xl md:text-3xl font-black text-slate-950 uppercase tracking-tight leading-snug">
                {product.name}
              </h1>

              <p className="text-xs text-slate-500 font-medium mt-1">
                {product.tagline}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-3 pt-2">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-black text-slate-900">{product.rating}</span>
                <span className="text-xs text-slate-500">({product.reviewsCount} verified reviews)</span>
              </div>

              {/* Pricing */}
              <div className="mt-4 flex items-baseline gap-3 border-y border-slate-100 py-3.5">
                <span className="text-3xl font-black text-slate-950">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {discountPercent > 0 && (
                  <>
                    <span className="text-sm text-slate-400 line-through">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-xs">
                      Save {discountPercent}%
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <div className="flex justify-between items-center text-xs font-black uppercase tracking-wider text-slate-900 mb-2">
                  <span>Select Size</span>
                  <span className="text-fuchsia-600 font-bold cursor-pointer hover:underline">Size Guide</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-11 h-10 px-3 flex items-center justify-center text-xs font-black uppercase rounded-xs border transition ${
                        selectedSize === size
                          ? 'bg-slate-950 text-white border-slate-950 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector & CTAs */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-slate-300 rounded-xs bg-white text-slate-900">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-11 flex items-center justify-center text-lg font-bold hover:bg-slate-100 transition"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-black text-xs">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-11 flex items-center justify-center text-lg font-bold hover:bg-slate-100 transition"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    for (let i = 0; i < quantity; i++) {
                      onAddToCart(product);
                    }
                  }}
                  className="flex-1 h-11 tf-btn-primary font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 rounded-xs shadow-md"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add To Bag
                </button>

                <button
                  type="button"
                  onClick={() => onToggleWishlist(product.id)}
                  className={`h-11 px-3.5 border rounded-xs transition flex items-center justify-center ${
                    isWishlisted
                      ? 'border-pink-300 bg-pink-50 text-pink-600'
                      : 'border-slate-300 hover:border-pink-300 text-slate-600 hover:text-pink-600 bg-white'
                  }`}
                  title={isWishlisted ? "Remove from Wishlist" : "Save to Wishlist"}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-pink-600' : ''}`} />
                </button>
              </div>

              {/* Promo Banner */}
              <div className="bg-fuchsia-50/70 border border-fuchsia-200/60 p-3 rounded-xs text-xs">
                <p className="font-bold text-slate-900">
                  Special Offer: Apply coupon <span className="font-black text-fuchsia-700">TAKEFASHION20</span> at checkout for 20% off.
                </p>
              </div>
            </div>

            {/* Pincode Delivery Check */}
            <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-xs">
              <label className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-1.5 mb-2">
                <MapPin className="w-4 h-4 text-fuchsia-600" />
                Delivery Options & Availability
              </label>
              <form onSubmit={handlePincodeCheck} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="Enter 6-digit PIN code"
                  className="bg-white border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-900 rounded-xs flex-1 focus:outline-none focus:border-fuchsia-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 text-xs font-black uppercase tracking-wider rounded-xs transition"
                >
                  Check
                </button>
              </form>
              {deliveryStatus && (
                <p className={`text-xs font-bold mt-2 ${deliveryStatus.valid ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {deliveryStatus.message}
                </p>
              )}
            </div>

            {/* Description & Specs */}
            <div className="border-t border-slate-100 pt-5 space-y-4">
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-2">
                  Product Overview
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {product.techSpecs && (
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-2">
                    Craft & Specifications
                  </h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                    {product.techSpecs.map((spec, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-fuchsia-600 shrink-0" />
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {product.styleTip && (
                <div className="bg-slate-100/70 p-3.5 rounded-xs border-l-2 border-fuchsia-600">
                  <span className="text-[10px] font-black uppercase tracking-widest text-fuchsia-700 block mb-0.5">
                    Stylist Recommendation
                  </span>
                  <p className="text-xs text-slate-700 italic">
                    "{product.styleTip}"
                  </p>
                </div>
              )}
            </div>

            {/* Assurance Badges */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-600 text-center">
              <div className="p-2 bg-white border border-slate-100 rounded-xs">
                <Truck className="w-4 h-4 text-orange-500 mx-auto mb-1" />
                <span>Express Courier</span>
              </div>
              <div className="p-2 bg-white border border-slate-100 rounded-xs">
                <RefreshCw className="w-4 h-4 text-fuchsia-600 mx-auto mb-1" />
                <span>7-Day Easy Swap</span>
              </div>
              <div className="p-2 bg-white border border-slate-100 rounded-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                <span>100% Genuine</span>
              </div>
            </div>

          </div>

        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section className="mt-20 pt-12 border-t border-slate-200">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-fuchsia-600">
                  Curated Pairs
                </span>
                <h2 className="text-2xl font-black uppercase text-slate-950 mt-0.5">
                  Complete The Look
                </h2>
              </div>
              <Link
                to={`/${product.audience?.toLowerCase() || 'men'}`}
                className="text-xs font-black uppercase tracking-wider text-slate-700 hover:text-fuchsia-600"
              >
                View Category →
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onProductClick={onProductClick}
                  onAddToCart={onAddToCart}
                  onToggleWishlist={onToggleWishlist}
                  isWishlisted={wishlistIds.includes(p.id)}
                />
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
