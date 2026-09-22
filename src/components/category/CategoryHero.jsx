import React from 'react';
import { Sparkles } from 'lucide-react';

const HERO_DATA = {
  men: {
    bgClass: 'from-slate-950 via-slate-900 to-slate-800 text-white',
    badge: 'MEN’S COLLECTION 2026',
    title: 'Modern Tailoring & Everyday Essentials',
    description: 'Clean cuts, high-density cottons, and relaxed silhouettes built for confident daily movement.',
    image: 'https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&q=85&w=1200',
    accent: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/30'
  },
  women: {
    bgClass: 'from-purple-950 via-fuchsia-950 to-pink-950 text-white',
    badge: 'WOMEN’S RUNWAY EDIT',
    title: 'Effortless Fluidity & Expressive Style',
    description: 'From bias-cut slip dresses to contemporary organza and structured denim—discover the new aesthetic.',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=85&w=1200',
    accent: 'bg-fuchsia-500/20 text-fuchsia-200 border-fuchsia-400/30'
  },
  kids: {
    bgClass: 'from-amber-950 via-orange-950 to-rose-950 text-white',
    badge: 'KIDS ACTIVE & COZY',
    title: 'Playful Energy Built for Everyday Curiosity',
    description: 'Super-soft skin-safe organic fabrics designed to move, run and explore without restrictions.',
    image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&q=85&w=1200',
    accent: 'bg-orange-500/20 text-orange-200 border-orange-400/30'
  },
  jewellery: {
    bgClass: 'from-slate-950 via-purple-950 to-rose-950 text-white',
    badge: 'JEWELLERY ATELIER',
    title: 'Architectural Heritage Meets Street Minimal',
    description: 'Indo-Western fusion earrings, chokers, cuffs and rings protected with certified anti-tarnish technology.',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=85&w=1200',
    accent: 'bg-purple-500/20 text-purple-200 border-purple-400/30'
  },
  accessories: {
    bgClass: 'from-stone-950 via-neutral-900 to-zinc-900 text-white',
    badge: 'ACCESSORIES & LIFESTYLE',
    title: 'The Signature Details That Complete The Look',
    description: 'Pebbled leather bags, cushioned fly-knit sneakers, scratch-proof watches and polarized eyewear.',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=85&w=1200',
    accent: 'bg-stone-500/20 text-stone-200 border-stone-400/30'
  },
  offers: {
    bgClass: 'from-fuchsia-950 via-purple-950 to-orange-900 text-white',
    badge: 'EXCLUSIVE DISCOUNTS',
    title: 'Limited-Time TakeFashion Curated Deals',
    description: 'Enjoy verified price drops across menswear, womenswear, accessories and jewellery.',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=85&w=1200',
    accent: 'bg-orange-500/20 text-orange-200 border-orange-400/30'
  }
};

export default function CategoryHero({ categoryKey = 'men', currentSubcategory = null }) {
  const data = HERO_DATA[categoryKey] || HERO_DATA.men;

  return (
    <section className={`relative overflow-hidden bg-gradient-to-r ${data.bgClass} mb-8 rounded-xs border border-white/10 shadow-lg`}>
      <div className="absolute inset-0 bg-black/40 mix-blend-multiply pointer-events-none" />
      
      {/* Background imagery with subtle parallax-feel overlay */}
      <div className="absolute inset-y-0 right-0 w-full lg:w-1/2 opacity-35 lg:opacity-60 overflow-hidden pointer-events-none">
        <img
          src={data.image}
          alt={data.title}
          className="w-full h-full object-cover object-center transform scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-transparent to-transparent hidden lg:block" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-10 py-12 md:py-16 grid lg:grid-cols-12 items-center gap-8">
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest border rounded-xs backdrop-blur-md ${data.accent}`}>
              <Sparkles className="w-3 h-3 inline mr-1" />
              {currentSubcategory ? `${data.badge} • ${currentSubcategory}` : data.badge}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight leading-tight">
            {currentSubcategory || data.title}
          </h1>

          <p className="text-sm md:text-base text-white/80 max-w-xl font-medium leading-relaxed">
            {data.description}
          </p>
        </div>
      </div>
    </section>
  );
}
