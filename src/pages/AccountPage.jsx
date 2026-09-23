import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Package, Heart, MapPin, Settings, LogOut, Sparkles, CheckCircle2 } from 'lucide-react';
import { authService } from '../services/authService';
import { addressService } from '../services/addressService';
import { orderService } from '../services/orderService';
import { ALL_PRODUCTS } from '../catalog';
import ProductCard from '../components/product/ProductCard';

export default function AccountPage({ onShowToast, onAddToCart, onBuyNow, onToggleWishlist, wishlistIds = [], onProductClick, products = ALL_PRODUCTS }) {
  const navigate = useNavigate();
  const [currentUser] = useState(() => authService.getCurrentUser());
  const [activeTab, setActiveTab] = useState('orders'); // 'overview', 'orders', 'wishlist', 'addresses', 'settings'
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [isLoadingAccountData, setIsLoadingAccountData] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login', { replace: true, state: { from: { pathname: '/account' } } });
      return undefined;
    }

    let active = true;
    Promise.all([orderService.listOrders(), addressService.listAddresses()])
      .then(([backendOrders, backendAddresses]) => {
        if (!active) return;
        setOrders(backendOrders.map((order) => ({
          rawId: order.id,
          id: order.orderNumber || order.id,
          date: order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN') : 'Recently placed',
          status: order.status || 'PENDING',
          paymentStatus: order.paymentStatus || 'PENDING',
          itemsCount: order.items?.length || 0,
          total: Number(order.total || 0),
          items: (order.items || []).map((item) => ({
            name: item.productName,
            size: item.size || 'Standard',
            price: Number(item.unitPrice || 0),
            qty: item.quantity,
          })),
        })));
        setAddresses(backendAddresses.map((address) => ({
          id: address.id,
          title: address.isDefault ? 'Default Address' : 'Saved Address',
          isDefault: address.isDefault,
          recipient: address.fullName,
          phone: address.phone,
          line1: address.addressLine1,
          city: address.city,
          state: address.state,
          pincode: address.postalCode,
        })));
      })
      .catch(() => {
        if (active) {
          setOrders([]);
          setAddresses([]);
        }
      })
      .finally(() => {
        if (active) setIsLoadingAccountData(false);
      });

    return () => {
      active = false;
    };
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  const handleLogout = () => {
    authService.logout();
    if (onShowToast) {
      onShowToast({
        type: 'info',
        title: 'Signed Out',
        message: 'You have been signed out safely.'
      });
    }
    navigate('/');
  };

  const wishlistedProducts = products.filter((p) => wishlistIds.includes(p.id));

  const navItems = [
    { id: 'overview', label: 'Overview', icon: <User className="w-4 h-4" /> },
    { id: 'orders', label: 'Recent Orders', count: orders.length, icon: <Package className="w-4 h-4" /> },
    { id: 'wishlist', label: 'My Wishlist', count: wishlistIds.length, icon: <Heart className="w-4 h-4" /> },
    { id: 'addresses', label: 'Saved Addresses', count: addresses.length, icon: <MapPin className="w-4 h-4" /> },
    { id: 'settings', label: 'Account Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#fffafc] py-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Account Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white p-6 md:p-8 rounded-xs border border-slate-800 shadow-md mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-fuchsia-600 to-orange-500 rounded-full flex items-center justify-center font-black text-xl text-white shadow-md">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight">
                  {currentUser.name}
                </h1>
                <span className="bg-white/10 text-orange-300 text-[10px] font-black uppercase px-2 py-0.5 rounded-xs border border-white/20">
                  {currentUser.tier || 'TakeFashion Member'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {currentUser.email} • {currentUser.phone}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-white/30 hover:border-rose-400 hover:text-rose-300 text-xs font-black uppercase tracking-wider rounded-xs transition flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Navigation Sidebar */}
          <aside className="lg:col-span-3 bg-white border border-slate-200/90 rounded-xs p-4 tf-shadow-card space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full text-left px-3.5 py-2.5 rounded-xs text-xs font-bold uppercase tracking-wider transition flex items-center justify-between ${
                  activeTab === item.id
                    ? 'bg-slate-900 text-white font-black'
                    : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={activeTab === item.id ? 'text-orange-400' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    activeTab === item.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            ))}
          </aside>

          {/* Right Content Area */}
          <main className="lg:col-span-9 bg-white border border-slate-200/90 rounded-xs p-6 md:p-8 tf-shadow-card min-h-[460px]">
            
            {/* TAB: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight text-slate-950">
                    Account Overview
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Summary of your fashion preferences and active orders.
                  </p>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xs">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Total Orders</p>
                    <p className="text-2xl font-black text-slate-950 mt-1">{orders.length}</p>
                    <span className="text-[11px] text-fuchsia-600 font-bold cursor-pointer" onClick={() => setActiveTab('orders')}>
                      View Order History →
                    </span>
                  </div>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xs">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Wishlist Items</p>
                    <p className="text-2xl font-black text-slate-950 mt-1">{wishlistIds.length}</p>
                    <span className="text-[11px] text-fuchsia-600 font-bold cursor-pointer" onClick={() => setActiveTab('wishlist')}>
                      Browse Wishlist →
                    </span>
                  </div>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xs">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Default Shipping</p>
                    <p className="text-xs font-bold text-slate-900 mt-2 truncate">
                      {addresses[0]?.city || 'Gurugram'}, {addresses[0]?.state || 'Haryana'}
                    </p>
                    <span className="text-[11px] text-fuchsia-600 font-bold cursor-pointer" onClick={() => setActiveTab('addresses')}>
                      Manage Addresses →
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-fuchsia-50 to-orange-50 border border-fuchsia-200/60 rounded-xs flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-fuchsia-600 shrink-0" />
                    <div>
                      <p className="text-xs font-black uppercase tracking-wider text-slate-900">
                        Seasonal Voucher Ready: TAKEFASHION20
                      </p>
                      <p className="text-xs text-slate-600">Apply this code on your cart to save 20% on all orders above ₹999.</p>
                    </div>
                  </div>
                  <Link to="/" className="px-3 py-1.5 bg-slate-900 text-white font-black text-[11px] uppercase rounded-xs shrink-0">
                    Shop Now
                  </Link>
                </div>
              </div>
            )}

            {isLoadingAccountData && (
              <p className="text-xs font-bold text-slate-500">Loading your account data...</p>
            )}

            {/* TAB: ORDERS */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight text-slate-950">
                    Order History
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Track delivery status and view past purchases.
                  </p>
                </div>

                {orders.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-slate-200 rounded-xs">
                    <Package className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-xs font-black uppercase tracking-wider text-slate-800">No orders placed yet</p>
                    <p className="text-xs text-slate-500 mt-1">Explore our latest drops and place your first order.</p>
                    <Link to="/" className="inline-block mt-4 px-4 py-2 bg-slate-900 text-white text-xs font-bold uppercase rounded-xs">
                      Explore Marketplace
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((ord) => (
                      <div key={ord.id} className="border border-slate-200 rounded-xs p-5 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 text-xs">
                          <div>
                            <span className="font-black text-slate-900">{ord.id}</span>
                            <span className="text-slate-400 ml-2">Placed on {ord.date}</span>
                          </div>
                          <a href={orderService.invoiceUrl(ord.rawId)} className="text-[10px] font-black uppercase text-fuchsia-600 hover:underline">Download invoice</a>
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-xs border ${ord.status === 'DECLINED' || ord.paymentStatus === 'FAILED' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                              <CheckCircle2 className="w-3 h-3" /> {ord.status}
                            </span>
                            <span className="font-black text-slate-950 text-sm">
                              ₹{ord.total.toLocaleString('en-IN')}
                            </span>
                          </div>
                          <p className="text-[10px] uppercase font-black text-slate-500">Payment: {ord.paymentStatus.replaceAll('_', ' ')}</p>
                        </div>

                        <div className="space-y-2">
                          {ord.items.map((it, idx) => (
                            <div key={idx} className="flex justify-between items-center text-xs">
                              <div>
                                <p className="font-bold text-slate-900">{it.name}</p>
                                <p className="text-[11px] text-slate-400">Size: {it.size} • Qty: {it.qty}</p>
                              </div>
                              <span className="font-semibold text-slate-700">₹{it.price.toLocaleString('en-IN')}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: WISHLIST */}
            {activeTab === 'wishlist' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight text-slate-950">
                    Saved Wishlist ({wishlistIds.length})
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Pieces you have bookmarked for your collection.
                  </p>
                </div>

                {wishlistedProducts.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-slate-200 rounded-xs">
                    <Heart className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-xs font-black uppercase tracking-wider text-slate-800">Your wishlist is empty</p>
                    <p className="text-xs text-slate-500 mt-1">Click the heart icon on any piece to save it for later.</p>
                    <Link to="/" className="inline-block mt-4 px-4 py-2 bg-slate-900 text-white text-xs font-bold uppercase rounded-xs">
                      Explore Fashion
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {wishlistedProducts.map((p) => (
                      <ProductCard
                        key={p.id}
                        product={p}
                        onProductClick={onProductClick}
                        onAddToCart={onAddToCart}
                        onBuyNow={onBuyNow}
                        onToggleWishlist={onToggleWishlist}
                        isWishlisted={true}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: ADDRESSES */}
            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-black uppercase tracking-tight text-slate-950">
                      Saved Delivery Addresses
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Manage your primary shipping destinations.
                    </p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div key={addr.id} className="border border-slate-200 rounded-xs p-5 space-y-2 relative">
                      {addr.isDefault && (
                        <span className="bg-slate-900 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-xs inline-block mb-1">
                          Default Shipping
                        </span>
                      )}
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                        {addr.title} • {addr.recipient}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {addr.line1}<br />
                        {addr.city}, {addr.state} - {addr.pincode}
                      </p>
                      <p className="text-xs text-slate-400 font-medium">
                        Contact: {addr.phone}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: SETTINGS */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight text-slate-950">
                    Profile & Preferences
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Update your contact details and communication preferences.
                  </p>
                </div>

                <div className="max-w-md space-y-4 text-xs">
                  <div>
                    <label className="font-black uppercase text-slate-700 block mb-1">Full Name</label>
                    <input
                      type="text"
                      defaultValue={currentUser.name}
                      className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xs text-slate-900 font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-black uppercase text-slate-700 block mb-1">Email Address</label>
                    <input
                      type="email"
                      disabled
                      defaultValue={currentUser.email}
                      className="w-full bg-slate-100 border border-slate-200 p-2.5 rounded-xs text-slate-500 font-bold cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="font-black uppercase text-slate-700 block mb-1">Phone Number</label>
                    <input
                      type="tel"
                      defaultValue={currentUser.phone}
                      className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xs text-slate-900 font-bold"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (onShowToast) {
                        onShowToast({
                          type: 'success',
                          title: 'Preferences Saved',
                          message: 'Your profile settings have been updated.'
                        });
                      }
                    }}
                    className="px-5 py-2.5 bg-slate-900 text-white font-black uppercase text-xs rounded-xs hover:bg-fuchsia-600 transition"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}

          </main>

        </div>

      </div>
    </div>
  );
}
