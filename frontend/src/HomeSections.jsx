import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductGrid from './ProductGrid';

const categories = [
  { title: 'Men', copy: 'Everyday essentials with a sharper point of view.', image: 'https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&q=80&w=900' },
  { title: 'Women', copy: 'Statement silhouettes made for your next entrance.', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=900' },
  { title: 'Kids', copy: 'Playful layers for little personalities.', image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&q=80&w=900' },
];

const collections = [
  ['The Daily Edit', 'Clean lines, easy layers', 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=700'],
  ['After Dark', 'Pieces that hold the room', 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=700'],
  ['Jewellery', 'Small details, big energy', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=700'],
  ['Weekend Carry', 'Shoes and bags in motion', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=700'],
];

function SectionHeading({ eyebrow, title, action, onAction, actionHref }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
      <div>
        <p className="text-xs font-black tracking-[0.22em] uppercase text-fuchsia-600 mb-2">{eyebrow}</p>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-950">{title}</h2>
      </div>
      {action && (actionHref ? <Link to={actionHref} className="text-sm font-black uppercase tracking-wider text-slate-800 hover:text-fuchsia-600 inline-flex items-center gap-2">{action}<ArrowRight className="w-4 h-4" /></Link> : <button onClick={onAction} className="text-sm font-black uppercase tracking-wider text-slate-800 hover:text-fuchsia-600 inline-flex items-center gap-2">{action}<ArrowRight className="w-4 h-4" /></button>)}
    </div>
  );
}

export default function HomeSections({ products, categories = [], onProductClick, onAddToCart, onBuyNow, onToggleWishlist, wishlistIds }) {
  const jewellery = products.filter((product) => product.department === 'Jewellery').slice(0, 4);
  const newArrivals = products.filter((product) => product.isNew).slice(0, 4);
  const categoryCards = categories.length
    ? categories.map((category) => ({
        title: category.name,
        copy: category.description || 'Fresh arrivals curated for your wardrobe.',
        image: category.imageUrl || 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=900',
        href: `/${category.slug}`,
      }))
    : [
        { title: 'Men', copy: 'Everyday essentials with a sharper point of view.', image: 'https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&q=80&w=900', href: '/men' },
        { title: 'Women', copy: 'Statement silhouettes made for your next entrance.', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=900', href: '/women' },
        { title: 'Kids', copy: 'Playful layers for little personalities.', image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&q=80&w=900', href: '/kids' },
      ];

  return (
    <div className="bg-[#fffafc] text-slate-950">
      <section className="relative overflow-hidden bg-[#201326] text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-700/70 via-violet-900/40 to-orange-500/50" />
        <div className="relative max-w-7xl mx-auto min-h-[580px] px-4 md:px-8 py-20 grid lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-xl">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-300 mb-5">TAKEFASHION / NEW SEASON</p>
            <h1 className="text-5xl md:text-7xl font-black leading-[0.94] tracking-tight">Your Style.<br /><span className="text-fuchsia-200">Your Take.</span></h1>
            <p className="mt-6 text-lg text-white/80 max-w-md leading-relaxed">Discover fashion, jewellery and accessories curated for every style.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/men" className="px-6 py-3.5 bg-white text-slate-950 font-black uppercase tracking-wider text-sm hover:bg-orange-300 transition">Shop Now</Link>
              <Link to="/women" className="px-6 py-3.5 border border-white/50 text-white font-black uppercase tracking-wider text-sm hover:bg-white/10 transition">Explore Collections</Link>
            </div>
          </div>
          <div className="relative lg:justify-self-end w-full max-w-md">
            <div className="absolute -inset-4 border border-orange-300/50 rotate-3" />
            <img src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=85&w=1000" alt="TakeFashion new season styling" className="relative w-full aspect-[4/5] object-cover" />
            <div className="absolute -bottom-5 -left-5 bg-orange-400 text-slate-950 p-4 font-black uppercase tracking-wider text-xs">Curated for<br />your point of view</div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <SectionHeading eyebrow="Start with a mood" title="Shop by Category" />
        <div className="grid md:grid-cols-3 gap-5">
          {categoryCards.map((category) => <Link key={category.title} to={category.href} className="group text-left relative overflow-hidden min-h-[360px] bg-slate-200">
            <img src={category.image} alt={category.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
            <div className="absolute bottom-0 p-6 text-white"><h3 className="text-3xl font-black">{category.title}</h3><p className="mt-1 text-sm text-white/75 max-w-[220px]">{category.copy}</p><span className="mt-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-orange-300">Shop now <ArrowRight className="w-4 h-4" /></span></div>
          </Link>)}
        </div>
      </section>

      <section className="bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16"><SectionHeading eyebrow="Curated edits" title="Featured Collections" action="View all" actionHref="/women" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{collections.map(([title, copy, image]) => <Link key={title} to={title === 'Jewellery' ? '/jewellery' : title === 'Weekend Carry' ? '/accessories/bags' : title === 'After Dark' ? '/women' : '/men'} className="group text-left"><div className="aspect-[3/4] overflow-hidden bg-slate-100"><img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" /></div><h3 className="mt-4 font-black text-lg">{title}</h3><p className="text-sm text-slate-500">{copy}</p></Link>)}</div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16"><SectionHeading eyebrow="Seen everywhere" title="Trending Now" action="Shop all" actionHref="/men" /><ProductGrid products={products.slice(0, 4)} onProductClick={onProductClick} onAddToCart={onAddToCart} onBuyNow={onBuyNow} onToggleWishlist={onToggleWishlist} wishlistIds={wishlistIds} /></section>

      <section className="bg-[#f7eef8]"><div className="max-w-7xl mx-auto px-4 md:px-8 py-16"><SectionHeading eyebrow="Just landed" title="New Arrivals" /><ProductGrid products={newArrivals.length ? newArrivals : products.slice(0, 4)} onProductClick={onProductClick} onAddToCart={onAddToCart} onBuyNow={onBuyNow} onToggleWishlist={onToggleWishlist} wishlistIds={wishlistIds} /></div></section>

      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16"><div className="grid lg:grid-cols-2 gap-6 items-stretch"><div className="bg-[#28153f] text-white p-8 md:p-12 flex flex-col justify-center"><p className="text-xs font-black tracking-[0.22em] uppercase text-orange-300">Jewellery edit</p><h2 className="mt-3 text-4xl md:text-5xl font-black">Complete Your Look</h2><p className="mt-4 text-white/70 max-w-sm">Layer colour, shine and a little attitude into every outfit.</p><Link to="/jewellery" className="mt-8 self-start px-5 py-3 bg-orange-400 text-slate-950 font-black uppercase text-xs tracking-wider">Shop Jewellery</Link></div><ProductGrid products={jewellery.slice(0, 2)} onProductClick={onProductClick} onAddToCart={onAddToCart} onBuyNow={onBuyNow} onToggleWishlist={onToggleWishlist} wishlistIds={wishlistIds} /></div></section>

      <section className="bg-white border-y border-slate-200"><div className="max-w-7xl mx-auto px-4 md:px-8 py-16"><SectionHeading eyebrow="The finishing touch" title="Step Out in Style" /><div className="grid md:grid-cols-2 gap-5"><Link to="/accessories/shoes" className="relative min-h-[260px] overflow-hidden text-left"><img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=85&w=1000" alt="Shoes edit" className="absolute inset-0 w-full h-full object-cover" /><div className="absolute inset-0 bg-slate-950/40" /><span className="absolute bottom-6 left-6 text-white text-3xl font-black">Shoes</span></Link><Link to="/accessories/bags" className="relative min-h-[260px] overflow-hidden text-left"><img src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=85&w=1000" alt="Bags edit" className="absolute inset-0 w-full h-full object-cover" /><div className="absolute inset-0 bg-slate-950/40" /><span className="absolute bottom-6 left-6 text-white text-3xl font-black">Bags</span></Link></div></div></section>

      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16"><div className="bg-gradient-to-r from-fuchsia-700 to-orange-500 p-8 md:p-12 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6"><div><p className="text-xs font-black uppercase tracking-[0.22em] text-orange-100">Limited time</p><h2 className="mt-2 text-4xl font-black">Exclusive Offers</h2><p className="mt-2 text-white/80">Fresh drops, considered prices, zero compromise on style.</p></div><Link to="/offers" className="px-6 py-3 bg-white text-slate-950 font-black uppercase text-sm tracking-wider">View Offers</Link></div></section>

      <section className="bg-slate-950 text-white"><div className="max-w-7xl mx-auto px-4 md:px-8 py-14 flex flex-col md:flex-row gap-8 items-center justify-between"><div><p className="text-xs font-black uppercase tracking-[0.22em] text-orange-300">Stay in the loop</p><h2 className="mt-2 text-3xl font-black">The TakeFashion edit, in your inbox.</h2></div><form className="flex w-full md:w-auto" onSubmit={(event) => event.preventDefault()}><input type="email" required placeholder="Your email address" className="min-w-0 w-full md:w-72 px-4 py-3 text-slate-950 outline-none" /><button className="px-5 py-3 bg-orange-400 text-slate-950 font-black uppercase text-xs">Subscribe</button></form></div></section>
    </div>
  );
}
