import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Sparkles, Truck, RefreshCw, ShieldCheck } from 'lucide-react';
import FilterSidebar from './FilterSidebar';
import ProductGrid from './ProductGrid';
import CategoryHero from './components/category/CategoryHero';
import { ALL_PRODUCTS, CATEGORY_CONFIG, CATEGORY_PATHS } from './catalog';

const titleCase = (value) =>
  value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

function getCategoryPills(root) {
  const config = CATEGORY_CONFIG[root];
  if (!config) return [];
  const pills = [{ label: `All ${config.label}`, href: `/${root}` }];

  Object.entries(config.children).forEach(([group, items]) => {
    if (items.length > 0) {
      items.forEach((item) => {
        pills.push({
          label: item,
          href: `/${root}/${group}/${item.toLowerCase().replaceAll(' ', '-')}`
        });
      });
    } else {
      pills.push({
        label: titleCase(group),
        href: `/${root}/${group}`
      });
    }
  });

  return pills;
}

export default function CategoryPage({ onProductClick, onAddToCart, onBuyNow, onToggleWishlist, wishlistIds = [], products: catalogProducts = ALL_PRODUCTS, categories = [] }) {
  const { pathname } = useLocation();
  const root = pathname.split('/')[1] || 'men';
  const parts = CATEGORY_PATHS[pathname] || [titleCase(root)];
  const currentSubcategory = parts.length > 1 ? parts[parts.length - 1] : null;
  const dynamicCategory = categories.find((category) => category.slug === root || category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === root);
  const config = CATEGORY_CONFIG[root] || { label: dynamicCategory?.name || titleCase(root), title: dynamicCategory?.name || titleCase(root), themeBg: 'bg-white' };

  const [maxPrice, setMaxPrice] = useState(6500);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('featured');
  const [selectedPill, setSelectedPill] = useState('all');

  const categoryPills = getCategoryPills(root);
  const availableSubcategories = config?.children ? Object.values(config.children).flat() : [];

  const products = catalogProducts.filter((product) => {
    const productCategoryName = String(product.category || product.audience || product.department || '').toLowerCase();
    const normalizedRoot = root.toLowerCase();
    const normalizedProductCategory = productCategoryName.replace(/[^a-z0-9]+/g, '-');
    const normalizedDisplayCategory = String(config.label || '').toLowerCase();

    let matchesRoot = false;
    if (root === 'offers') {
      matchesRoot = product.originalPrice > product.price;
    } else if (root === 'jewellery') {
      matchesRoot = product.department === 'Jewellery' || product.audience === 'Jewellery';
    } else if (root === 'wishlist') {
      matchesRoot = wishlistIds.includes(product.id);
    } else {
      matchesRoot = normalizedProductCategory === normalizedRoot || productCategoryName === normalizedDisplayCategory || product.department === config.label || product.audience === config.label;
    }

    if (!matchesRoot) return false;

    if (currentSubcategory) {
      const target = currentSubcategory.toLowerCase();
      const matchesSub =
        (product.subcategory && product.subcategory.toLowerCase() === target) ||
        (product.category && product.category.toLowerCase() === target) ||
        (product.department && product.department.toLowerCase() === target);
      if (!matchesSub) return false;
    }

    if (selectedPill !== 'all') {
      const matchesLocal =
        (product.subcategory && product.subcategory.toLowerCase() === selectedPill.toLowerCase()) ||
        (product.category && product.category.toLowerCase() === selectedPill.toLowerCase());
      if (!matchesLocal) return false;
    }

    if (product.price > maxPrice) return false;
    if (minRating > 0 && product.rating < minRating) return false;

    return true;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0; // featured default
  });

  return (
    <div className={`min-h-screen ${config.themeBg} transition-colors duration-500`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mb-6 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-fuchsia-600 transition">Home</Link>
          {parts.map((part, index) => {
            const pathSlice = parts.slice(0, index + 1);
            const targetHref = `/${pathSlice.map(p => p.toLowerCase().replaceAll(' ', '-')).join('/')}`;
            const isLast = index === parts.length - 1;
            return (
              <React.Fragment key={`${part}-${index}`}>
                <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
                {isLast ? (
                  <span className="text-slate-900 font-black">{part}</span>
                ) : (
                  <Link to={targetHref} className="hover:text-fuchsia-600 transition">{part}</Link>
                )}
              </React.Fragment>
            );
          })}
        </nav>

        {/* Atmospheric Branded Category Hero */}
        <CategoryHero categoryKey={root} currentSubcategory={currentSubcategory} />

        {/* Subcategory Pills Quick Navigation */}
        {categoryPills.length > 1 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {categoryPills.map((pill) => {
                const isActive = pathname === pill.href || (pill.href === `/${root}` && !currentSubcategory);
                return (
                  <Link
                    key={pill.href}
                    to={pill.href}
                    className={`shrink-0 px-4 py-2 text-xs font-black uppercase tracking-wider transition rounded-xs border ${
                      isActive
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-white/80 hover:bg-white text-slate-700 border-slate-200/90 hover:border-fuchsia-300'
                    }`}
                  >
                    {pill.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Main Products Grid with Filter Sidebar */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Filter Sidebar */}
          <aside className="lg:col-span-3">
            <FilterSidebar
              categories={availableSubcategories}
              selectedCategory={selectedPill}
              onSelectCategory={setSelectedPill}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              minPrice={500}
              priceLimit={6500}
              sortBy={sortBy}
              setSortBy={setSortBy}
              minRating={minRating}
              setMinRating={setMinRating}
              onReset={() => {
                setSelectedPill('all');
                setMaxPrice(6500);
                setMinRating(0);
                setSortBy('featured');
              }}
            />
          </aside>

          {/* Product Grid & Meta Bar */}
          <div className="lg:col-span-9 space-y-6">
            <div className="bg-white/70 backdrop-blur-sm border border-slate-200/80 px-5 py-3.5 rounded-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
              <div className="flex items-center gap-2 text-slate-600 font-medium">
                <span className="font-black text-slate-950 text-sm">{products.length}</span>
                <span>pieces curated for this edit</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500 font-bold">
                <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                <span>Express Dispatch Available</span>
              </div>
            </div>

            <ProductGrid
              products={products}
              onProductClick={onProductClick}
              onAddToCart={onAddToCart}
              onBuyNow={onBuyNow}
              onToggleWishlist={onToggleWishlist}
              wishlistIds={wishlistIds}
            />

            {/* Editorial Style Note */}
            {products.length > 0 && (
              <div className="mt-14 bg-white border border-slate-200/90 p-8 md:p-10 rounded-xs shadow-xs">
                <div className="max-w-2xl">
                  <span className="text-[10px] font-black uppercase tracking-widest text-fuchsia-600">
                    The TakeFashion Style Edit
                  </span>
                  <h3 className="text-xl md:text-2xl font-black text-slate-950 mt-1 uppercase tracking-tight">
                    Engineered For Modern Living
                  </h3>
                  <p className="text-xs md:text-sm text-slate-600 mt-2.5 leading-relaxed">
                    Every piece in our {config.title.toLowerCase()} is vetted for superior fabrication, flattering silhouette, and lasting colorfastness. Transition seamlessly from high-pace weekdays to relaxed weekend evenings.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 mt-6 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-2.5 text-slate-700 font-bold">
                    <Truck className="w-4 h-4 text-orange-500" />
                    <span>Free Shipping Above ₹999</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-slate-700 font-bold">
                    <RefreshCw className="w-4 h-4 text-fuchsia-600" />
                    <span>7-Day Easy Size Swaps</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-slate-700 font-bold">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>100% Genuine Quality</span>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
