import React, { useState } from 'react';
import { X, Trash2, ArrowRight, ShoppingBag, Tag, CheckCircle2, AlertCircle } from 'lucide-react';
import { couponService } from './services/couponService';

export default function CartDrawer({
  isOpen,
  onClose,
  cart = [],
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout
}) {
  const [promoCode, setPromoCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  if (!isOpen) return null;

  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const discount = appliedCoupon ? appliedCoupon.discount : 0;
  const shippingThreshold = 999;
  const shipping = subtotal >= shippingThreshold || subtotal === 0 ? 0 : 99;
  const grandTotal = Math.max(0, subtotal - discount + shipping);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    setCouponError('');
    const result = couponService.validateCoupon(promoCode, subtotal);
    if (result.valid) {
      setAppliedCoupon(result);
      setCouponError('');
    } else {
      setCouponError(result.message);
      setAppliedCoupon(null);
    }
  };

  const handleRemovePromo = () => {
    setAppliedCoupon(null);
    setPromoCode('');
    setCouponError('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white border-l border-slate-200 h-full flex flex-col justify-between shadow-2xl relative animate-in slide-in-from-right duration-300">
        
        {/* Cart Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-fuchsia-600" />
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
              Shopping Bag ({totalItemsCount})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-800 transition rounded-full hover:bg-slate-100"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-slate-50 px-5 py-3 border-b border-slate-100 text-xs">
          {subtotal >= shippingThreshold ? (
            <p className="text-emerald-700 font-bold flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Unlocked Free Express Shipping Across India!
            </p>
          ) : (
            <div>
              <p className="text-slate-700 font-medium text-[11px] mb-1.5">
                Add <span className="text-fuchsia-700 font-black">₹{shippingThreshold - subtotal}</span> more for <span className="font-bold">Free Express Shipping</span>
              </p>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-fuchsia-600 to-orange-500 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (subtotal / shippingThreshold) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Cart Items Scrollable List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-20 text-slate-400 space-y-4">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-300">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="text-sm font-black uppercase tracking-wider text-slate-800">Your bag is currently empty</p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">Discover modern fashion, jewellery and lifestyle essentials.</p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-slate-900 text-white font-black text-xs uppercase tracking-wider rounded-xs hover:bg-fuchsia-600 transition"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-3.5 p-3.5 bg-slate-50/70 border border-slate-200/80 rounded-xs relative group"
              >
                <img
                  src={item.heroImage}
                  alt={item.name}
                  className="w-20 h-24 object-cover bg-slate-200 rounded-xs shrink-0"
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-black text-slate-900 uppercase line-clamp-1 pr-6">
                      {item.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{item.subcategory || item.category}</p>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-xs font-black text-slate-950">₹{item.price.toLocaleString('en-IN')}</span>
                      {item.originalPrice > item.price && (
                        <span className="text-[10px] text-slate-400 line-through">₹{item.originalPrice.toLocaleString('en-IN')}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    {/* Quantity controls */}
                    <div className="flex items-center border border-slate-300 rounded-xs bg-white text-slate-800">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center text-xs font-bold hover:bg-slate-100"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="w-7 text-center font-black text-xs">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center text-xs font-bold hover:bg-slate-100"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-slate-400 hover:text-rose-600 transition p-1"
                      title="Remove piece"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout Summary */}
        {cart.length > 0 && (
          <div className="p-5 bg-white border-t border-slate-100 space-y-4">
            {/* Promo Code Input */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xs text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Coupon "{appliedCoupon.code}" applied (-₹{appliedCoupon.discount})</span>
                  </div>
                  <button
                    onClick={handleRemovePromo}
                    className="text-xs font-bold text-rose-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Coupon: TAKEFASHION20"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 text-xs uppercase bg-slate-50 border border-slate-300 text-slate-900 rounded-xs font-semibold focus:outline-none focus:border-fuchsia-600"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 text-white font-black text-xs uppercase tracking-wider rounded-xs hover:bg-slate-800 transition shrink-0"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponError && (
                <p className="text-[11px] font-bold text-rose-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {couponError}
                </p>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs border-t border-slate-100 pt-3">
              <div className="flex justify-between text-slate-600 font-medium">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Discount</span>
                  <span>-₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600 font-medium">
                <span>Shipping</span>
                <span>{shipping === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `₹${shipping}`}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-950 pt-2 border-t border-slate-100">
                <span>Total Amount</span>
                <span className="text-base text-fuchsia-700">₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              onClick={() => {
                onProceedToCheckout({
                  subtotal,
                  discount,
                  shipping,
                  grandTotal,
                  appliedCoupon: appliedCoupon?.code || null
                });
              }}
              className="w-full py-3 tf-btn-primary font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 rounded-xs shadow-md"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
