import React, { useEffect } from 'react';
import { CheckCircle2, Heart, ShoppingBag, X, Info } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3200);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const icons = {
    cart: <ShoppingBag className="w-5 h-5 text-fuchsia-400 shrink-0" />,
    wishlist: <Heart className="w-5 h-5 text-pink-400 fill-pink-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-orange-400 shrink-0" />,
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-slate-900/95 backdrop-blur-md text-white border border-fuchsia-500/30 px-5 py-4 shadow-2xl flex items-center gap-3.5 max-w-md rounded-sm">
        {icons[toast.type] || icons.success}
        <div className="flex-1 pr-2">
          <p className="text-xs font-black uppercase tracking-wider text-fuchsia-300">
            {toast.title || 'TakeFashion Notification'}
          </p>
          <p className="text-sm font-medium text-slate-200 mt-0.5 leading-snug">
            {toast.message}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 transition"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

