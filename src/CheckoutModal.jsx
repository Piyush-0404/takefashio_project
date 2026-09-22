import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, CreditCard, Smartphone, Banknote, Sparkles, Truck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CheckoutModal({ isOpen, onClose, totals = {}, onClearCart }) {
  const [step, setStep] = useState('form'); // 'form' or 'success'
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [orderId, setOrderId] = useState('');

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    const generatedId = 'TF-ORD-' + Math.floor(100000 + Math.random() * 900000);
    setOrderId(generatedId);
    setStep('success');
    onClearCart();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex justify-center items-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 w-full max-w-3xl my-8 relative shadow-2xl rounded-xs p-6 md:p-10">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 transition p-1.5 rounded-full hover:bg-slate-100"
          aria-label="Close checkout"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'form' ? (
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-fuchsia-600">
                  TakeFashion Storefront
                </span>
                <h2 className="text-xl md:text-2xl font-black uppercase text-slate-950 tracking-tight">
                  Checkout Experience
                </h2>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xs border border-emerald-200 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>SSL Encrypted</span>
              </div>
            </div>

            {/* Prototype Notice */}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xs text-xs text-amber-800 font-medium mb-6 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Frontend Prototype:</strong> This is a simulation flow. No real charges or payment requests will be made.
              </span>
            </div>

            <form onSubmit={handlePlaceOrder} className="space-y-6">
              {/* Shipping Information */}
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
                  1. Shipping & Customer Contact
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-black uppercase text-slate-700 block mb-1">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Aanya Verma"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2 text-xs font-semibold rounded-xs focus:outline-none focus:border-fuchsia-600"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-black uppercase text-slate-700 block mb-1">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2 text-xs font-semibold rounded-xs focus:outline-none focus:border-fuchsia-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <label className="text-[11px] font-black uppercase text-slate-700 block mb-1">Delivery Address *</label>
                    <input
                      type="text"
                      name="address"
                      required
                      placeholder="Flat, building, street, area"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2 text-xs font-semibold rounded-xs focus:outline-none focus:border-fuchsia-600"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-black uppercase text-slate-700 block mb-1">Mobile Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="9876543210"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2 text-xs font-semibold rounded-xs focus:outline-none focus:border-fuchsia-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-black uppercase text-slate-700 block mb-1">City *</label>
                    <input
                      type="text"
                      name="city"
                      required
                      placeholder="e.g. Gurugram"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2 text-xs font-semibold rounded-xs focus:outline-none focus:border-fuchsia-600"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-black uppercase text-slate-700 block mb-1">State *</label>
                    <input
                      type="text"
                      name="state"
                      required
                      placeholder="e.g. Haryana"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2 text-xs font-semibold rounded-xs focus:outline-none focus:border-fuchsia-600"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-black uppercase text-slate-700 block mb-1">PIN Code *</label>
                    <input
                      type="text"
                      name="pincode"
                      required
                      maxLength={6}
                      placeholder="122002"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2 text-xs font-semibold rounded-xs focus:outline-none focus:border-fuchsia-600"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
                  2. Select Payment Preference
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'UPI', label: 'UPI / QR', icon: <Smartphone className="w-4 h-4" /> },
                    { id: 'Card', label: 'Cards', icon: <CreditCard className="w-4 h-4" /> },
                    { id: 'NetBanking', label: 'Net Banking', icon: <Banknote className="w-4 h-4" /> },
                    { id: 'COD', label: 'Cash on Delivery', icon: <Truck className="w-4 h-4" /> },
                  ].map((method) => (
                    <button
                      type="button"
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`p-3 border rounded-xs text-xs font-black uppercase tracking-wider flex flex-col items-center gap-1.5 transition ${
                        paymentMethod === method.id
                          ? 'border-fuchsia-600 bg-fuchsia-50 text-fuchsia-700'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {method.icon}
                      <span>{method.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Order Total Bar & Action */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-left w-full sm:w-auto">
                  <span className="text-[11px] text-slate-500 uppercase font-bold block">Total to Pay</span>
                  <span className="text-2xl font-black text-slate-950">
                    ₹{(totals.grandTotal || 0).toLocaleString('en-IN')}
                  </span>
                  {totals.discount > 0 && (
                    <span className="text-[11px] text-emerald-600 font-bold ml-2">
                      (Includes ₹{totals.discount} savings)
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 tf-btn-primary font-black text-xs uppercase tracking-widest rounded-xs shadow-md flex items-center justify-center gap-2"
                >
                  Confirm & Place Order
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Order Confirmation Step */
          <div className="text-center py-8 space-y-5 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-xs border border-emerald-200 inline-block mb-2">
                Order Received (Prototype Demo)
              </span>
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-slate-950">
                Thank You for Ordering!
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Your order reference is <strong className="text-slate-900">{orderId}</strong>
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xs p-5 max-w-md mx-auto text-left text-xs space-y-2">
              <p className="text-slate-600">
                <strong className="text-slate-900">Delivering to:</strong> {formData.name || 'Aanya Verma'}, {formData.address || 'Signature Palms'}, {formData.city || 'Gurugram'} - {formData.pincode || '122002'}
              </p>
              <p className="text-slate-600">
                <strong className="text-slate-900">Payment:</strong> {paymentMethod} (Prototype Mode)
              </p>
              <p className="text-slate-600">
                <strong className="text-slate-900">Estimated Dispatch:</strong> Within 24 hours
              </p>
            </div>

            <div className="pt-4 flex justify-center gap-3">
              <button
                onClick={onClose}
                className="px-6 py-3 bg-slate-900 text-white font-black text-xs uppercase tracking-wider rounded-xs hover:bg-fuchsia-600 transition"
              >
                Continue Shopping
              </button>
              <Link
                to="/account"
                onClick={onClose}
                className="px-6 py-3 border border-slate-200 text-slate-800 font-black text-xs uppercase tracking-wider rounded-xs hover:bg-slate-50 transition"
              >
                View in Account
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
