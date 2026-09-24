import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, ShieldCheck, Heart, ArrowRight } from 'lucide-react';

export default function Footer({ onNewsletterSubmit }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      if (onNewsletterSubmit) onNewsletterSubmit(email);
    }
  };

  return (
    <footer className="bg-slate-950 text-white border-t border-slate-800/80">
      {/* Brand Ethos Bar */}
      <div className="border-b border-slate-900 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="space-y-1">
            <h4 className="text-xs font-black uppercase tracking-wider text-orange-400">Authentic Curation</h4>
            <p className="text-xs text-slate-400">Handpicked modern edits across all fashion categories.</p>
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-black uppercase tracking-wider text-fuchsia-400">Fast Express Delivery</h4>
            <p className="text-xs text-slate-400">Free courier dispatch on all orders above ₹999.</p>
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-black uppercase tracking-wider text-orange-400">7-Day Easy Exchange</h4>
            <p className="text-xs text-slate-400">Hassle-free size swaps and seamless doorstep pickup.</p>
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-black uppercase tracking-wider text-fuchsia-400">Protected Finishes</h4>
            <p className="text-xs text-slate-400">Verified anti-tarnish coating on all jewellery lines.</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 grid sm:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Brand Column */}
        <div className="lg:col-span-2">
          <Link to="/" className="inline-block">
            <img 
              src="/takefashion-logo.png" 
              alt="TakeFashion" 
              className="h-12 w-auto bg-white p-1.5 object-contain rounded-xs" 
            />
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-400">
            TAKEFASHION is a modern destination for fashion, accessories, jewellery and lifestyle products. Designed for every version of you.
          </p>

          <div className="mt-5 space-y-2">
            <p className="flex items-center gap-2.5 text-xs text-slate-300">
              <Mail className="w-4 h-4 text-orange-400 shrink-0" />
              <span>support@takefashion.in</span>
            </p>
            <p className="flex items-center gap-2.5 text-xs text-slate-300">
              <MapPin className="w-4 h-4 text-orange-400 shrink-0" />
              <span>Designed with pride in New Delhi & Mumbai, India</span>
            </p>
          </div>

          <div className="mt-6 flex items-center gap-3 text-slate-400">
            <span className="text-xs font-bold text-slate-300">Follow our edits:</span>
            {/* Instagram SVG */}
            <span className="p-2 bg-slate-900 hover:bg-fuchsia-600 hover:text-white transition rounded-full cursor-pointer" aria-label="Instagram">
              <svg className="w-3.5 h-3.5 fill-currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </span>
            {/* Facebook SVG */}
            <span className="p-2 bg-slate-900 hover:bg-fuchsia-600 hover:text-white transition rounded-full cursor-pointer" aria-label="Facebook">
              <svg className="w-3.5 h-3.5 fill-currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </span>
          </div>
        </div>

        {/* Shop Navigation */}
        <div>
          <h3 className="font-black uppercase tracking-wider text-xs text-white mb-4">Shop Collections</h3>
          <ul className="space-y-2.5 text-xs font-medium text-slate-400">
            <li><Link to="/men" className="hover:text-white hover:translate-x-0.5 transition inline-block">Men's Fashion</Link></li>
            <li><Link to="/women" className="hover:text-white hover:translate-x-0.5 transition inline-block">Women's Fashion</Link></li>
            <li><Link to="/kids" className="hover:text-white hover:translate-x-0.5 transition inline-block">Kids Collection</Link></li>
            <li><Link to="/jewellery" className="hover:text-white hover:translate-x-0.5 transition inline-block">Jewellery Atelier</Link></li>
            <li><Link to="/accessories" className="hover:text-white hover:translate-x-0.5 transition inline-block">Accessories & Bags</Link></li>
            <li><Link to="/offers" className="text-orange-400 hover:text-orange-300 font-bold hover:translate-x-0.5 transition inline-block">Special Offers</Link></li>
          </ul>
        </div>

        {/* Customer Care */}
        <div>
          <h3 className="font-black uppercase tracking-wider text-xs text-white mb-4">Customer Care</h3>
          <ul className="space-y-2.5 text-xs font-medium text-slate-400">
            <li><span className="hover:text-white cursor-pointer">Help & FAQs</span></li>
            <li><span className="hover:text-white cursor-pointer">Track Your Order</span></li>
            <li><span className="hover:text-white cursor-pointer">Shipping & Delivery</span></li>
            <li><span className="hover:text-white cursor-pointer">Easy Returns & Exchanges</span></li>
            <li><span className="hover:text-white cursor-pointer">Size Guide</span></li>
            <li className="flex items-center gap-1.5 text-orange-300 pt-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Secure Checkout</span>
            </li>
          </ul>
        </div>

        {/* Account & Newsletter */}
        <div>
          <h3 className="font-black uppercase tracking-wider text-xs text-white mb-4">Account & Updates</h3>
          <ul className="space-y-2.5 text-xs font-medium text-slate-400 mb-6">
            <li><Link to="/account" className="hover:text-white">My Account</Link></li>
            <li><Link to="/wishlist" className="hover:text-white flex items-center gap-1.5"><Heart className="w-3 h-3 text-pink-400" /> My Wishlist</Link></li>
            <li><Link to="/login" className="hover:text-white">Sign In / Register</Link></li>
          </ul>

          <div className="pt-2 border-t border-slate-900">
            <h4 className="text-[11px] font-black uppercase tracking-wider text-fuchsia-300 mb-2">
              Join The Newsletter
            </h4>
            {subscribed ? (
              <p className="text-xs text-emerald-400 font-medium">Thank you for subscribing!</p>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="px-3 py-2 text-xs bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-500 rounded-xs"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-gradient-to-r from-fuchsia-600 to-orange-500 hover:opacity-90 text-white text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition rounded-xs"
                >
                  Subscribe <ArrowRight className="w-3 h-3" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-slate-900 max-w-7xl mx-auto px-4 md:px-8 py-6 text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-4">
        <span>© 2026 TAKEFASHION. All rights reserved. A modern fashion marketplace.</span>
        <div className="flex items-center gap-6">
          <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
          <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
          <span className="hover:text-slate-400 cursor-pointer">Security</span>
        </div>
      </div>
    </footer>
  );
}

