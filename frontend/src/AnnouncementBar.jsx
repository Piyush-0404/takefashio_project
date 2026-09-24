import React from 'react';
import { Truck, Sparkles, RefreshCw, Tag } from 'lucide-react';

export default function AnnouncementBar() {
  const items = [
    { icon: <Truck className="w-3.5 h-3.5 text-orange-200" />, text: "Free Express Shipping Across India on Orders Above ₹999" },
    { icon: <Tag className="w-3.5 h-3.5 text-orange-200" />, text: "New Season Drops • Use Code TAKEFASHION20 for Flat 20% Off" },
    { icon: <Sparkles className="w-3.5 h-3.5 text-orange-200" />, text: "Curated Edits in Fashion, Accessories & Jewellery" },
    { icon: <RefreshCw className="w-3.5 h-3.5 text-orange-200" />, text: "Hassle-Free 7-Day Easy Exchanges & Returns" }
  ];

  return (
    <div className="bg-gradient-to-r from-fuchsia-700 via-purple-700 to-orange-600 text-white overflow-hidden py-2 font-bold text-[11px] uppercase tracking-widest border-b border-fuchsia-800/40 select-none">
      <div className="animate-marquee whitespace-nowrap flex gap-12 items-center">
        {items.map((item, idx) => (
          <span key={`a-${idx}`} className="flex items-center gap-2">
            {item.icon}
            {item.text}
          </span>
        ))}
        {/* Duplicate for seamless infinite marquee loop */}
        {items.map((item, idx) => (
          <span key={`b-${idx}`} className="flex items-center gap-2">
            {item.icon}
            {item.text}
          </span>
        ))}
      </div>
    </div>
  );
}
