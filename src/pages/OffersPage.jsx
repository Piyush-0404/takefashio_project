import React from 'react';
import { Sparkles, Percent, Copy, Check } from 'lucide-react';
import ProductGrid from '../ProductGrid';
import { apiClient } from '../services/apiClient';
import { subscribeCatalogUpdates } from '../services/catalogSync';

export default function OffersPage({ onProductClick, onAddToCart, onBuyNow, onToggleWishlist, wishlistIds = [], onShowToast, products = [] }) {
  const [copiedCode, setCopiedCode] = React.useState(null);
  const [offers, setOffers] = React.useState([]);

  React.useEffect(() => {
    let active = true;
    const loadOffers = () => apiClient.get('/api/offers').then((payload) => {
      if (active) setOffers(Array.isArray(payload?.offers) ? payload.offers : []);
    }).catch(() => undefined);
    loadOffers();
    const unsubscribe = subscribeCatalogUpdates((event) => {
      if (event.entity === 'offer') loadOffers();
    });
    return () => { active = false; unsubscribe(); };
  }, []);

  const discountedProducts = products.filter(
    (p) => p.originalPrice && p.originalPrice > p.price
  );

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    if (onShowToast) {
      onShowToast({
        type: 'success',
        title: 'Coupon Copied',
        message: `Code "${code}" copied to clipboard!`
      });
    }
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fdf2f8] via-[#fff7ed] to-[#fffafc] py-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Promotional Hero */}
        <section className="relative overflow-hidden bg-gradient-to-r from-pink-950 via-purple-950 to-orange-950 text-white rounded-xs p-8 md:p-14 shadow-xl border border-fuchsia-500/20 mb-12">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-fuchsia-600/20 via-transparent to-transparent pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-black uppercase tracking-widest text-orange-300 rounded-xs">
              <Sparkles className="w-3.5 h-3.5" />
              Limited-Time TakeFashion Event
            </span>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight leading-tight">
              Curated Style.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-300 via-pink-200 to-orange-300">
                Uncompromising Value.
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-white/80 font-medium leading-relaxed max-w-lg">
              Discover certified discounts up to 50% across our entire marketplace. Claim active promo codes below and apply them directly at checkout.
            </p>
          </div>
        </section>

        {/* Voucher Cards Grid */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-fuchsia-600">
                Instant Savings
              </span>
              <h2 className="text-xl md:text-2xl font-black uppercase text-slate-950">
                Active Promo Vouchers
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {offers.map((offer) => {
              const c = { code: offer.slug, title: offer.name, desc: offer.description || 'Limited-time TakeFashion offer.', gradient: 'from-fuchsia-600 to-orange-500' };
              return (
              <div
                key={c.code}
                className="bg-white border border-slate-200/90 rounded-xs p-6 flex flex-col justify-between tf-shadow-card hover:tf-shadow-card-hover transition relative overflow-hidden"
              >
                <div className={`absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r ${c.gradient}`} />
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-fuchsia-700">
                    <Percent className="w-4 h-4" />
                    <span className="text-[11px] font-black uppercase tracking-wider">TakeFashion Perks</span>
                  </div>
                  <h3 className="text-base font-black text-slate-950 uppercase">{c.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{c.desc}</p>
                </div>

                <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <span className="font-mono text-xs font-black bg-slate-100 px-3 py-1.5 rounded-xs text-slate-900 border border-slate-200">
                    {c.code}
                  </span>
                  <button
                    onClick={() => handleCopy(c.code)}
                    className="px-3.5 py-1.5 bg-slate-900 hover:bg-fuchsia-600 text-white font-black text-xs uppercase tracking-wider rounded-xs transition flex items-center gap-1.5"
                  >
                    {copiedCode === c.code ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy Code
                      </>
                    )}
                  </button>
                </div>
              </div>
              );
            })}
            {!offers.length && <p className="text-sm text-slate-500 md:col-span-3">No active offers right now.</p>}
          </div>
        </section>

        {/* Discounted Product Showcase */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-fuchsia-600">
                Trending Deals
              </span>
              <h2 className="text-xl md:text-2xl font-black uppercase text-slate-950">
                Discounted Styles ({discountedProducts.length} pieces)
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-bold">Verified Best Prices</span>
          </div>

          <ProductGrid
            products={discountedProducts}
            onProductClick={onProductClick}
            onAddToCart={onAddToCart}
            onBuyNow={onBuyNow}
            onToggleWishlist={onToggleWishlist}
            wishlistIds={wishlistIds}
          />
        </section>

      </div>
    </div>
  );
}
