import React, { useEffect, useState } from 'react';
import { Bell, ChevronDown, Heart, Menu, Search, ShoppingBag, X, User, LogOut } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import AnnouncementBar from './AnnouncementBar';
import { authService } from './services/authService';
import { categoryService } from './services/categoryService';
import { subscribeCatalogUpdates } from './services/catalogSync';

const NAV_MENUS = {
  Men: {
    href: '/men',
    accentColor: 'border-slate-800',
    highlight: {
      title: 'Men’s Daily Edit',
      desc: 'Structured linen shirts & selvedge denim built for daily rotation.',
      link: '/men/clothing/shirts'
    },
    columns: [
      {
        title: 'Clothing',
        href: '/men/clothing',
        items: [
          { label: 'T-Shirts', href: '/men/clothing/t-shirts' },
          { label: 'Shirts', href: '/men/clothing/shirts' },
          { label: 'Jeans', href: '/men/clothing/jeans' },
          { label: 'Trousers', href: '/men/clothing/trousers' },
          { label: 'Jackets', href: '/men/clothing/jackets' },
          { label: 'Ethnic Wear', href: '/men/clothing/ethnic-wear' }
        ]
      },
      {
        title: 'Footwear & Carry',
        href: '/men/shoes',
        items: [
          { label: 'Derby Shoes & Boots', href: '/men/shoes' },
          { label: 'Minimalist Accessories', href: '/men/accessories' }
        ]
      }
    ]
  },
  Women: {
    href: '/women',
    accentColor: 'border-fuchsia-600',
    highlight: {
      title: 'Runway Silhouettes',
      desc: 'Liquid satin dresses & modern organza drapes ready for dinner.',
      link: '/women/clothing/dresses'
    },
    columns: [
      {
        title: 'Clothing',
        href: '/women/clothing',
        items: [
          { label: 'Dresses', href: '/women/clothing/dresses' },
          { label: 'Tops & Knits', href: '/women/clothing/tops' },
          { label: 'Jeans', href: '/women/clothing/jeans' },
          { label: 'Trousers', href: '/women/clothing/trousers' },
          { label: 'Kurtis', href: '/women/clothing/kurtis' },
          { label: 'Sarees', href: '/women/clothing/sarees' }
        ]
      },
      {
        title: 'Shoes & Accessories',
        href: '/women/shoes',
        items: [
          { label: 'Sculpted Block Heels', href: '/women/shoes' },
          { label: 'Crossbody Bags', href: '/women/accessories' }
        ]
      }
    ]
  },
  Kids: {
    href: '/kids',
    accentColor: 'border-orange-500',
    highlight: {
      title: 'Active Explorers',
      desc: 'Organic cotton fleece hoodies & grip runners made for play.',
      link: '/kids/clothing'
    },
    columns: [
      {
        title: 'Collections',
        href: '/kids',
        items: [
          { label: 'Kids Clothing', href: '/kids/clothing' },
          { label: 'Kids Footwear', href: '/kids/shoes' },
          { label: 'Kids Backpacks & Gear', href: '/kids/accessories' }
        ]
      }
    ]
  },
  Jewellery: {
    href: '/jewellery',
    accentColor: 'border-purple-600',
    highlight: {
      title: 'Artisanal Statement',
      desc: '100% Anti-tarnish coated rings, chokers and jhumkas.',
      link: '/jewellery/earrings'
    },
    columns: [
      {
        title: 'By Category',
        href: '/jewellery',
        items: [
          { label: 'Earrings & Jhumkas', href: '/jewellery/earrings' },
          { label: 'Necklaces & Chokers', href: '/jewellery/necklaces' },
          { label: 'Bracelets & Cuffs', href: '/jewellery/bracelets' },
          { label: 'Bangles', href: '/jewellery/bangles' },
          { label: 'Statement Rings', href: '/jewellery/rings' },
          { label: 'Jewellery Sets', href: '/jewellery/jewellery-sets' },
          { label: 'Anklets', href: '/jewellery/anklets' }
        ]
      }
    ]
  },
  Accessories: {
    href: '/accessories',
    accentColor: 'border-stone-800',
    highlight: {
      title: 'Finishing Touches',
      desc: 'Italian-inspired leather bags, UV400 eyewear & mesh watches.',
      link: '/accessories/bags'
    },
    columns: [
      {
        title: 'Carry & Details',
        href: '/accessories',
        items: [
          { label: 'Leather Bags & Totes', href: '/accessories/bags' },
          { label: 'Shoes & Sneakers', href: '/accessories/shoes' },
          { label: 'Chrono Mesh Watches', href: '/accessories/watches' },
          { label: 'Reversible Belts', href: '/accessories/belts' },
          { label: 'Polarized Sunglasses', href: '/accessories/sunglasses' },
          { label: 'RFID Wallets', href: '/accessories/wallets' }
        ]
      }
    ]
  }
};

export default function Header({ cartCount, wishlistCount, onOpenCart, onOpenSearch, notifications = [], unreadNotifications = 0, onMarkNotificationRead, onMarkAllNotificationsRead }) {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState(null);
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await categoryService.listCategories();
        setCategories(response || []);
      } catch (error) {
        setCategories([]);
      }
    };

    loadCategories();
    const unsubscribe = subscribeCatalogUpdates(() => loadCategories());
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleAuthChange = (e) => setCurrentUser(e.detail);
    window.addEventListener('takefashion:auth_change', handleAuthChange);
    return () => window.removeEventListener('takefashion:auth_change', handleAuthChange);
  }, []);

  const closeAll = () => {
    setActiveMenu(null);
    setMobileMenuOpen(false);
    setExpandedMobileCategory(null);
    setAccountDropdownOpen(false);
  };

  const categoryMenus = categories.length
    ? categories.map((category) => [category.name, {
        href: `/${category.slug}`,
        accentColor: 'border-slate-800',
        highlight: {
          title: category.name,
          desc: category.description || 'Fresh arrivals from our latest collection.',
          link: `/${category.slug}`,
        },
        columns: [{
          title: category.name,
          href: `/${category.slug}`,
          items: (category.children || []).map((child) => ({ label: child.name, href: `/${category.slug}/${child.slug}` })),
        }],
      }])
    : Object.entries(NAV_MENUS);

  const handleAccountClick = (e) => {
    e.preventDefault();
    if (currentUser) {
      setAccountDropdownOpen(!accountDropdownOpen);
    } else {
      navigate('/login');
    }
  };

  const handleLogout = () => {
    authService.logout();
    closeAll();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-shadow duration-300">
      <AnnouncementBar />

      <div className={`max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between gap-4 transition-all duration-200 ${scrolled ? 'py-2.5' : 'py-3.5'}`}>
        
        {/* Left: Mobile Toggle & Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-slate-800 hover:text-fuchsia-600 lg:hidden transition"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <Link to="/" onClick={closeAll} className="flex items-center shrink-0" aria-label="TakeFashion Home">
            <img
              src="/takefashion-logo.png"
              alt="TakeFashion"
              className="h-9 md:h-11 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Center: Desktop Navigation with Mega Menu */}
        <nav 
          className="hidden lg:flex items-center gap-7 font-bold text-xs uppercase tracking-wider text-slate-700"
          onMouseLeave={() => setActiveMenu(null)}
        >
          <NavLink
            to="/"
            onClick={closeAll}
            className={({ isActive }) =>
              `py-3 transition hover:text-fuchsia-600 ${isActive ? 'text-fuchsia-600 font-black' : ''}`
            }
          >
            Home
          </NavLink>

          {categoryMenus.map(([label, menu]) => (
            <div
              key={label}
              className="relative"
              onMouseEnter={() => setActiveMenu(label)}
            >
              <NavLink
                to={menu.href}
                className={({ isActive }) =>
                  `py-3 flex items-center gap-1 transition hover:text-fuchsia-600 ${
                    isActive ? 'text-fuchsia-600 font-black' : ''
                  }`
                }
              >
                {label}
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${activeMenu === label ? 'rotate-180 text-fuchsia-600' : 'text-slate-400'}`} />
              </NavLink>

              {/* Desktop Mega Menu Dropdown */}
              {activeMenu === label && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 w-[540px] animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="bg-white border border-slate-200 shadow-2xl p-6 rounded-xs grid grid-cols-12 gap-6 text-left">
                    <div className="col-span-7 space-y-5">
                      {menu.columns.map((col) => (
                        <div key={col.title}>
                          <Link
                            to={col.href}
                            onClick={closeAll}
                            className="font-black text-xs text-slate-950 uppercase tracking-wider hover:text-fuchsia-600 block pb-1 border-b border-slate-100 mb-2"
                          >
                            {col.title}
                          </Link>
                          <div className="grid grid-cols-2 gap-y-1.5 gap-x-2">
                            {col.items.map((item) => (
                              <Link
                                key={item.label}
                                to={item.href}
                                onClick={closeAll}
                                className="text-xs font-medium text-slate-600 hover:text-fuchsia-600 transition"
                              >
                                {item.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Featured Mega Menu Card */}
                    <div className="col-span-5 bg-gradient-to-br from-slate-50 to-fuchsia-50/50 p-4 border border-slate-100 flex flex-col justify-between rounded-xs">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-fuchsia-600 bg-fuchsia-100/60 px-2 py-0.5 inline-block mb-2">
                          Editorial Pick
                        </span>
                        <h4 className="text-sm font-black text-slate-900 leading-snug">
                          {menu.highlight.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          {menu.highlight.desc}
                        </p>
                      </div>
                      <Link
                        to={menu.highlight.link}
                        onClick={closeAll}
                        className="mt-4 inline-block text-[11px] font-black uppercase tracking-wider text-fuchsia-700 hover:text-fuchsia-900 underline underline-offset-4"
                      >
                        Explore Edit →
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          <NavLink
            to="/offers"
            onClick={closeAll}
            className={({ isActive }) =>
              `py-3 font-black text-orange-600 hover:text-orange-700 transition flex items-center gap-1 ${
                isActive ? 'border-b-2 border-orange-600' : ''
              }`
            }
          >
            Offers
            <span className="bg-orange-100 text-orange-700 text-[10px] px-1.5 py-0.2 rounded font-black">20% OFF</span>
          </NavLink>
        </nav>

        {/* Right: Actions (Search, Notifications, Wishlist, Cart, Account) */}
        <div className="flex items-center gap-1 md:gap-2">
          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="p-2 text-slate-700 hover:text-fuchsia-600 transition rounded-full hover:bg-slate-100/60"
            title="Search products"
            aria-label="Search TakeFashion"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Notifications Trigger */}
          {currentUser && <div className="relative"><button onClick={() => setNotificationsOpen((open) => !open)} className="p-2 text-slate-700 hover:text-fuchsia-600 transition relative rounded-full hover:bg-slate-100/60" title="Notifications" aria-label="Notifications"><Bell className="w-5 h-5" />{unreadNotifications > 0 && <span className="absolute top-1 right-1 bg-fuchsia-600 text-white font-black text-[10px] min-w-4 h-4 px-1 rounded-full flex items-center justify-center">{unreadNotifications}</span>}</button>{notificationsOpen && <div className="absolute right-0 top-full mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white border border-slate-200 shadow-xl p-3 z-50"><div className="flex items-center justify-between border-b pb-2"><strong className="text-xs uppercase">Notifications</strong><button onClick={onMarkAllNotificationsRead} className="text-[10px] font-bold text-fuchsia-600">Mark all read</button></div><div className="max-h-80 overflow-y-auto">{notifications.length ? notifications.map((notification) => <button key={notification.id} onClick={() => { onMarkNotificationRead?.(notification.id); if (notification.link) navigate(notification.link); }} className={`block w-full text-left py-3 border-b border-slate-100 ${notification.readAt ? 'opacity-60' : ''}`}><p className="text-xs font-black">{notification.title}</p><p className="text-[11px] text-slate-600 mt-1">{notification.message}</p><p className="text-[10px] text-slate-400 mt-1">{new Date(notification.createdAt).toLocaleString('en-IN')}</p></button>) : <p className="py-6 text-xs text-slate-500 text-center">No notifications.</p>}</div></div>}</div>}

          {/* Wishlist Link */}
          <NavLink
            to="/wishlist"
            onClick={closeAll}
            className="p-2 text-slate-700 hover:text-fuchsia-600 transition relative rounded-full hover:bg-slate-100/60"
            title="Wishlist"
            aria-label="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white font-black text-[10px] min-w-4 h-4 px-1 rounded-full flex items-center justify-center leading-none shadow-sm animate-in zoom-in">
                {wishlistCount}
              </span>
            )}
          </NavLink>

          {/* Cart Trigger */}
          <button
            onClick={onOpenCart}
            className="p-2 text-slate-700 hover:text-fuchsia-600 transition relative rounded-full hover:bg-slate-100/60"
            title="Shopping Bag"
            aria-label="View Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 bg-gradient-to-r from-fuchsia-600 to-orange-500 text-white font-black text-[10px] min-w-4 h-4 px-1 rounded-full flex items-center justify-center leading-none shadow-sm animate-in zoom-in">
                {cartCount}
              </span>
            )}
          </button>

          {/* Account Button with Dropdown */}
          <div className="relative">
            <button
              onClick={handleAccountClick}
              className="ml-1 px-3 py-1.5 border border-slate-200 hover:border-fuchsia-300 text-slate-800 hover:text-fuchsia-600 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition rounded-xs"
              aria-label="Account"
            >
              <User className="w-3.5 h-3.5 text-fuchsia-600" />
              <span className="hidden sm:inline">
                {currentUser ? currentUser.name.split(' ')[0] : 'Account'}
              </span>
            </button>

            {/* Account Popover */}
            {currentUser && accountDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-slate-200 shadow-xl rounded-xs p-3 z-50 text-left animate-in fade-in slide-in-from-top-2">
                <div className="pb-2 border-b border-slate-100 mb-2">
                  <p className="text-xs font-black text-slate-900">{currentUser.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                </div>
                <div className="space-y-1 text-xs font-bold text-slate-700">
                  <Link
                    to="/account"
                    onClick={closeAll}
                    className="block px-2 py-1.5 hover:bg-fuchsia-50 hover:text-fuchsia-700 rounded-xs transition"
                  >
                    My Dashboard
                  </Link>
                  <Link
                    to="/wishlist"
                    onClick={closeAll}
                    className="block px-2 py-1.5 hover:bg-fuchsia-50 hover:text-fuchsia-700 rounded-xs transition"
                  >
                    My Wishlist ({wishlistCount})
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-2 py-1.5 text-rose-600 hover:bg-rose-50 rounded-xs flex items-center gap-1.5 transition mt-1 pt-1.5 border-t border-slate-100"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[calc(100%)] bg-white border-b border-slate-200 shadow-2xl max-h-[80vh] overflow-y-auto p-5 space-y-4 animate-in slide-in-from-top duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">
              Browse TakeFashion
            </span>
            {currentUser ? (
              <Link to="/account" onClick={closeAll} className="text-xs font-black text-fuchsia-600">
                Hi, {currentUser.name.split(' ')[0]} →
              </Link>
            ) : (
              <Link to="/login" onClick={closeAll} className="text-xs font-black text-fuchsia-600">
                Sign In / Register →
              </Link>
            )}
          </div>

          <NavLink to="/" onClick={closeAll} className="block py-2 text-sm font-black text-slate-900">
            Home
          </NavLink>

          {categoryMenus.map(([label, menu]) => (
            <div key={label} className="border-t border-slate-100 pt-2">
              <div className="flex items-center justify-between">
                <Link to={menu.href} onClick={closeAll} className="py-2 font-black text-sm text-slate-800">
                  {label}
                </Link>
                <button
                  onClick={() =>
                    setExpandedMobileCategory(expandedMobileCategory === label ? null : label)
                  }
                  className="p-2 text-slate-500 hover:text-fuchsia-600"
                  aria-label={`Expand ${label}`}
                >
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      expandedMobileCategory === label ? 'rotate-180 text-fuchsia-600' : ''
                    }`}
                  />
                </button>
              </div>

              {expandedMobileCategory === label && (
                <div className="pl-3 pb-3 space-y-3 bg-slate-50 p-3 rounded-xs mt-1">
                  {menu.columns.map((col) => (
                    <div key={col.title}>
                      <Link
                        to={col.href}
                        onClick={closeAll}
                        className="text-xs font-black text-slate-900 uppercase block mb-1.5"
                      >
                        {col.title}
                      </Link>
                      <div className="space-y-1.5 pl-2">
                        {col.items.map((item) => (
                          <Link
                            key={item.label}
                            to={item.href}
                            onClick={closeAll}
                            className="block text-xs font-medium text-slate-600 hover:text-fuchsia-600"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          <NavLink
            to="/offers"
            onClick={closeAll}
            className="block border-t border-slate-100 pt-3 text-sm font-black text-orange-600 flex items-center justify-between"
          >
            <span>Offers & Deals</span>
            <span className="bg-orange-100 text-orange-700 text-[10px] px-2 py-0.5 rounded font-black">20% OFF</span>
          </NavLink>

          <div className="border-t border-slate-100 pt-4 flex gap-3">
            <NavLink
              to="/wishlist"
              onClick={closeAll}
              className="flex-1 py-2.5 text-center text-xs font-bold border border-slate-200 rounded-xs"
            >
              Wishlist ({wishlistCount})
            </NavLink>
            <Link
              to={currentUser ? "/account" : "/login"}
              onClick={closeAll}
              className="flex-1 py-2.5 text-center text-xs font-bold bg-slate-900 text-white rounded-xs"
            >
              {currentUser ? "Dashboard" : "Login"}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
