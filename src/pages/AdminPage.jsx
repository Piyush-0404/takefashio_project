import React, { useEffect, useState } from 'react';
import { Activity, BarChart3, Bell, Boxes, ImagePlus, LayoutDashboard, LogOut, Percent, Plus, RefreshCw, ShoppingCart, Tags, Users as UsersIcon, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../services/adminService';
import { authService } from '../services/authService';
import AdminProducts from '../components/admin/AdminProducts';

const tabs = [
  ['overview', 'Overview', LayoutDashboard],
  ['products', 'Products', Boxes],
  ['categories', 'Categories', Tags],
  ['orders', 'Orders', ShoppingCart],
  ['coupons', 'Coupons', Percent],
  ['offers', 'Offers', BarChart3],
  ['users', 'Customers', UsersIcon],
  ['notifications', 'Notifications', Bell],
  ['analytics', 'Analytics', Activity],
];

const emptyProduct = { name: '', slug: '', description: '', categoryId: '', price: '', basePrice: '', salePrice: '', brand: '', sku: '', gender: 'UNISEX', stock: '0', isFeatured: true, isNewArrival: true, isTrending: false };

export default function AdminPage({ onShowToast }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState({ metrics: null, products: [], categories: [], orders: [], coupons: [], offers: [], users: [] });
  const [productForm, setProductForm] = useState(emptyProduct);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [error, setError] = useState('');
  const [analytics, setAnalytics] = useState(null);
  const [analyticsRange, setAnalyticsRange] = useState('30d');
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      navigate('/login', { replace: true, state: { from: { pathname: '/admin' } } });
      return;
    }
    loadData();
  }, [user, navigate]);

  useEffect(() => {
    const rootCategories = data.categories.filter((category) => !category.parentId && category.isActive !== false);
    if (!rootCategories.length) return;
    if (!rootCategories.some((category) => category.id === productForm.categoryId)) {
      setProductForm((current) => ({ ...current, categoryId: rootCategories[0].id }));
    }
  }, [data.categories, productForm.categoryId]);

  useEffect(() => {
    if (activeTab === 'analytics' && !analytics) loadAnalytics();
  }, [activeTab]);

  async function loadData() {
    setError('');
    try {
      const [dashboard, products, categories, orders, coupons, offers, users] = await Promise.all([
        adminService.getDashboard(), adminService.getProducts(), adminService.getCategories(), adminService.getOrders(), adminService.getCoupons(), adminService.getOffers(), adminService.getUsers(),
      ]);
      setData({
        metrics: dashboard.metrics,
        products: products.products || [],
        categories: categories.categories || [],
        orders: orders.orders || [],
        coupons: coupons.coupons || [],
        offers: offers.offers || [],
        users: users.users || [],
      });
    } catch (loadError) {
      setError(loadError.message || 'Unable to load admin data.');
    }
  }

  async function loadAnalytics(range = analyticsRange) {
    setAnalyticsLoading(true);
    try { setAnalytics(await adminService.getAnalytics({ preset: range })); }
    catch (analyticsError) { setError(analyticsError.message || 'Unable to load analytics.'); }
    finally { setAnalyticsLoading(false); }
  }

  const notify = (type, title, message) => onShowToast?.({ type, title, message });
  const updateForm = (event) => setProductForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  async function uploadSelectedImages() {
    const uploads = [];
    for (const file of selectedFiles) {
      const response = await adminService.uploadImage(file);
      uploads.push({ imageUrl: new URL(response.url, window.location.origin).toString(), isPrimary: uploads.length === 0, sortOrder: uploads.length });
    }
    return uploads;
  }

  async function saveProduct(event) {
    event.preventDefault();
    setIsSaving(true);
    setError('');
    try {
      const categoryExists = data.categories.some((category) => category.id === productForm.categoryId && !category.parentId && category.isActive !== false);
      if (!categoryExists) throw new Error('Please select an active category before creating the product.');
      const images = await uploadSelectedImages();
      const payload = {
        ...productForm,
        price: Number(productForm.price),
        basePrice: Number(productForm.basePrice || productForm.price),
        salePrice: productForm.salePrice ? Number(productForm.salePrice) : null,
        stock: Number(productForm.stock || 0),
        images,
      };
      if (editingProductId) await adminService.updateProduct(editingProductId, payload);
      else await adminService.createProduct(payload);
      setProductForm(emptyProduct);
      setSelectedFiles([]);
      setEditingProductId(null);
      notify('success', 'Catalog Updated', editingProductId ? 'Product updated successfully.' : 'Product and images uploaded successfully.');
      await loadData();
    } catch (saveError) {
      setError(saveError.message || 'Unable to save product.');
    } finally {
      setIsSaving(false);
    }
  }

  function beginEditProduct(product) {
    setEditingProductId(product.id);
    setProductForm({
      name: product.name || '', slug: product.slug || '', description: product.description || '', categoryId: product.categoryId || product.category?.id || '', price: product.price || '', basePrice: product.basePrice || '', salePrice: product.salePrice || '', brand: product.brand || '', sku: product.sku || '', gender: product.gender || 'UNISEX', stock: product.stock || '0', isFeatured: product.isFeatured, isNewArrival: product.isNewArrival, isTrending: product.isTrending,
    });
    setSelectedFiles([]);
    setActiveTab('products');
  }

  async function deactivateProduct(product) {
    if (!window.confirm(`Deactivate ${product.name}? It will disappear from the storefront.`)) return;
    try {
      await adminService.deleteProduct(product.id);
      notify('success', 'Catalog Updated', 'Product deactivated and removed from the storefront.');
      await loadData();
    } catch (deleteError) {
      setError(deleteError.message || 'Unable to deactivate product.');
    }
  }

  async function updateOrder(orderId, status) {
    try {
      await adminService.updateOrder(orderId, status);
      notify('success', 'Order Updated', 'Order status saved.');
      await loadData();
    } catch (updateError) {
      setError(updateError.message || 'Unable to update order.');
    }
  }

  async function refundOrder(orderId) {
    if (!window.confirm('Start a Razorpay refund for this order?')) return;
    try { await adminService.refundOrder(orderId); notify('success', 'Refund Completed', 'Razorpay confirmed the refund.'); await loadData(); }
    catch (refundError) { setError(refundError.message || 'Unable to refund this order.'); }
  }

  async function handleLogout() {
    await authService.logout();
    navigate('/');
  }

  if (!user || user.role !== 'ADMIN') return null;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <div className="flex min-h-screen">
        <aside className="hidden lg:flex w-64 shrink-0 bg-slate-950 text-white p-5 flex-col">
          <div className="flex items-center gap-3 pb-8 border-b border-white/10">
            <div className="w-10 h-10 bg-orange-400 text-slate-950 font-black flex items-center justify-center">TF</div>
            <div><p className="font-black tracking-tight">TAKEFASHION</p><p className="text-[10px] uppercase tracking-widest text-orange-300">Admin workspace</p></div>
          </div>
          <nav className="pt-6 space-y-1 flex-1">
            {tabs.map(([id, label, Icon]) => <button key={id} onClick={() => setActiveTab(id)} className={`w-full flex items-center gap-3 px-3 py-3 text-xs font-black uppercase tracking-wider text-left rounded-xs ${activeTab === id ? 'bg-orange-400 text-slate-950' : 'text-slate-300 hover:bg-white/10'}`}><Icon className="w-4 h-4" />{label}</button>)}
          </nav>
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-3 text-xs font-black uppercase text-rose-300 border-t border-white/10"><LogOut className="w-4 h-4" />Sign out</button>
        </aside>

        <main className="flex-1 min-w-0">
          <header className="bg-white border-b border-slate-200 px-5 md:px-8 py-5 flex items-center justify-between gap-4">
            <div><p className="text-[10px] uppercase tracking-[0.25em] font-black text-orange-600">Operations console</p><h1 className="text-2xl font-black tracking-tight">{tabs.find(([id]) => id === activeTab)?.[1]}</h1></div>
            <button onClick={loadData} className="p-2 border border-slate-200 hover:border-orange-400" title="Refresh data"><RefreshCw className="w-4 h-4" /></button>
          </header>
          <div className="lg:hidden flex gap-2 overflow-x-auto bg-slate-950 p-3">{tabs.map(([id, label]) => <button key={id} onClick={() => setActiveTab(id)} className={`shrink-0 px-3 py-2 text-[10px] font-black uppercase ${activeTab === id ? 'bg-orange-400 text-slate-950' : 'text-white border border-white/20'}`}>{label}</button>)}</div>
          <section className="p-5 md:p-8 max-w-7xl mx-auto">
            {error && <div className="mb-5 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm flex justify-between gap-3"><span>{error}</span><button onClick={() => setError('')}><X className="w-4 h-4" /></button></div>}
            {activeTab === 'overview' && <Overview metrics={data.metrics} data={data} />}
            {activeTab === 'products' && <AdminProducts products={data.products} categories={data.categories} form={productForm} updateForm={updateForm} files={selectedFiles} setFiles={setSelectedFiles} saveProduct={saveProduct} isSaving={isSaving} editingProductId={editingProductId} onEdit={beginEditProduct} onDelete={deactivateProduct} onCancelEdit={() => { setEditingProductId(null); setProductForm(emptyProduct); setSelectedFiles([]); }} />}
            {activeTab === 'categories' && <Categories categories={data.categories} onSaved={loadData} notify={notify} />}
            {activeTab === 'orders' && <Orders orders={data.orders} updateOrder={updateOrder} refundOrder={refundOrder} />}
            {activeTab === 'coupons' && <Coupons coupons={data.coupons} onSaved={loadData} notify={notify} />}
            {activeTab === 'offers' && <Offers offers={data.offers} />}
            {activeTab === 'users' && <Users users={data.users} />}
            {activeTab === 'notifications' && <Notifications notify={notify} />}
            {activeTab === 'analytics' && <Analytics data={analytics} loading={analyticsLoading} range={analyticsRange} onRangeChange={(range) => { setAnalyticsRange(range); loadAnalytics(range); }} />}
          </section>
        </main>
      </div>
    </div>
  );
}

function Overview({ metrics, data }) { const cards = [['Products', metrics?.products ?? data.products.length, Boxes], ['Categories', metrics?.categories ?? data.categories.length, Tags], ['Customers', metrics?.customers ?? data.users.length, UsersIcon], ['Orders', metrics?.orders ?? data.orders.length, ShoppingCart]]; return <div className="space-y-8"><div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">{cards.map(([label, value, Icon]) => <div key={label} className="bg-white border border-slate-200 p-5"><Icon className="w-5 h-5 text-orange-500" /><p className="mt-6 text-[10px] uppercase font-black tracking-widest text-slate-400">{label}</p><p className="text-3xl font-black mt-1">{value}</p></div>)}</div><div className="bg-white border border-slate-200 p-6"><h2 className="font-black uppercase tracking-tight">Catalog health</h2><div className="mt-5 grid sm:grid-cols-3 gap-4 text-sm"><p><strong>{data.products.filter((p) => p.isActive).length}</strong> active products</p><p><strong>{data.orders.filter((o) => o.status === 'PENDING').length}</strong> pending orders</p><p><strong>{Number(metrics?.revenue || 0).toLocaleString('en-IN')}</strong> captured revenue</p></div></div></div> }
function Analytics({ data, loading, range, onRangeChange }) {
  const summary = data?.summary;
  const maxRevenue = Math.max(...(data?.trend || []).map((row) => row.revenue), 1);
  const maxProduct = Math.max(...(data?.productsPerformance || []).map((row) => row.revenue), 1);
  return <div className="space-y-6"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-xl font-black uppercase">Analytics</h2><p className="text-xs text-slate-500">Database-backed qualifying sales and customer reporting.</p></div><select value={range} onChange={(event) => onRangeChange(event.target.value)} className="border border-slate-300 p-2 text-xs font-bold"><option value="today">Today</option><option value="7d">Last 7 days</option><option value="30d">Last 30 days</option><option value="month">This month</option><option value="previous-month">Previous month</option></select></div>{loading && <div className="bg-white border border-slate-200 p-8 text-sm text-slate-500">Loading analytics...</div>}{!loading && !data && <div className="bg-white border border-slate-200 p-8 text-sm text-slate-500">Choose a date range to load analytics.</div>}{!loading && data && <><div className="grid sm:grid-cols-2 xl:grid-cols-5 gap-3">{[['Net sales', summary.netSales], ['Orders', summary.orderCount], ['Customers', summary.customersWithPurchases], ['Average order', summary.averageOrderValue], ['Refunds', summary.refunds]].map(([label, value]) => <div key={label} className="bg-white border border-slate-200 p-4"><p className="text-[10px] uppercase font-black tracking-widest text-slate-400">{label}</p><p className="text-2xl font-black mt-2">{label === 'Orders' || label === 'Customers' ? value : `₹${Number(value).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`}</p></div>)}</div><div className="grid lg:grid-cols-2 gap-5"><Panel title="Revenue trend">{data.trend.length ? <div className="space-y-2">{data.trend.map((row) => <div key={row.date} className="flex items-center gap-3 text-xs"><span className="w-20 text-slate-500">{row.date}</span><div className="h-5 bg-orange-400" style={{ width: `${Math.max(3, row.revenue / maxRevenue * 100)}%` }} /><span className="font-bold">₹{Number(row.revenue).toLocaleString('en-IN')}</span></div>)}</div> : <EmptyAnalytics />}</Panel><Panel title="Top products by revenue">{data.productsPerformance.length ? data.productsPerformance.map((row) => <div key={row.productId} className="flex items-center gap-3 py-2 border-b border-slate-100 text-xs"><span className="flex-1 font-bold">{row.product}</span><span>{row.units} units</span><div className="w-24 h-2 bg-orange-100"><div className="h-full bg-orange-500" style={{ width: `${row.revenue / maxProduct * 100}%` }} /></div><strong>₹{Number(row.revenue).toLocaleString('en-IN')}</strong></div>) : <EmptyAnalytics />}</Panel><Panel title="Category sales">{data.categoriesPerformance.length ? data.categoriesPerformance.map((row) => <div key={row.categoryId} className="flex justify-between py-2 border-b border-slate-100 text-xs"><strong>{row.category}</strong><span>{row.units} units · ₹{Number(row.revenue).toLocaleString('en-IN')}</span></div>) : <EmptyAnalytics />}</Panel><Panel title="Regional sales">{data.regions.length ? data.regions.map((row) => <div key={row.region} className="flex justify-between py-2 border-b border-slate-100 text-xs"><strong>{row.region}</strong><span>{row.orders} orders · {row.customers} customers · ₹{Number(row.revenue).toLocaleString('en-IN')}</span></div>) : <EmptyAnalytics />}</Panel><Panel title="Customer segments"><div className="grid grid-cols-2 gap-3 text-xs">{Object.entries(data.customers.segments).map(([segment, count]) => <div key={segment} className="border border-slate-200 p-3"><strong>{segment}</strong><p className="text-2xl font-black mt-1">{count}</p></div>)}</div><p className="text-[11px] text-slate-500 mt-3">Profit unavailable: the current schema has no reliable product cost price.</p></Panel></div></>}</div>;
}
function Panel({ title, children }) { return <div className="bg-white border border-slate-200 p-5"><h3 className="font-black uppercase text-sm mb-4">{title}</h3>{children}</div>; }
function EmptyAnalytics() { return <p className="text-xs text-slate-500">No qualifying data in this range.</p>; }

function Input({ label, ...props }) { return <label className="text-xs font-bold">{label}<input {...props} className="mt-1 w-full border border-slate-300 p-2.5" /></label> }
function Categories({ categories, onSaved, notify }) {
  const [form, setForm] = useState({ name: '', slug: '', parentId: '' });
  const [editingId, setEditingId] = useState(null);
  const save = async (event) => { event.preventDefault(); try { const payload = { ...form, parentId: form.parentId || null }; if (editingId) await adminService.updateCategory(editingId, payload); else await adminService.createCategory(payload); setForm({ name: '', slug: '', parentId: '' }); setEditingId(null); notify('success', 'Category Saved', 'Category changes are live.'); await onSaved(); } catch (error) { notify('error', 'Category Failed', error.message); } };
  const edit = (category) => { setEditingId(category.id); setForm({ name: category.name, slug: category.slug, parentId: category.parentId || '' }); };
  const remove = async (category) => { if (!window.confirm(`Deactivate ${category.name}?`)) return; try { await adminService.deleteCategory(category.id); notify('success', 'Category Deactivated', 'The category was removed from the storefront.'); await onSaved(); } catch (error) { notify('error', 'Category Failed', error.message); } };
  return <div className="space-y-5"><form onSubmit={save} className="bg-white border border-slate-200 p-6 grid md:grid-cols-4 gap-3"><Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /><Input label="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required /><label className="text-xs font-bold">Parent<select value={form.parentId} onChange={(e) => setForm({ ...form, parentId: e.target.value })} className="mt-1 w-full border border-slate-300 p-2.5"><option value="">Root category</option>{categories.filter((c) => !c.parentId && c.id !== editingId).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label><button className="bg-slate-950 text-white font-black uppercase text-xs">{editingId ? 'Save category' : 'Create category'}</button></form><List title="Categories" items={categories} render={(category) => <><div><strong>{category.name}</strong><span className="block text-xs text-slate-400">/{category.slug} {category.parent?.name ? `under ${category.parent.name}` : ''}</span></div><div className="flex gap-2"><button onClick={() => edit(category)} className="border px-2 py-1 text-xs font-bold">Edit</button>{category.isActive && <button onClick={() => remove(category)} className="border border-rose-200 px-2 py-1 text-xs font-bold text-rose-600">Deactivate</button>}</div></>} /></div>;
}

function Orders({ orders, updateOrder, refundOrder }) {
  const [selected, setSelected] = useState(null);
  return <><List title="Orders" items={orders} render={(order) => <><button onClick={() => setSelected(order)} className="text-left"><strong>{order.orderNumber || order.id}</strong><p className="text-xs text-slate-500">{order.user?.name || 'Customer'} · ₹{Number(order.total || 0).toLocaleString('en-IN')}</p></button><div className="flex gap-2"><button onClick={() => setSelected(order)} className="border px-2 py-1 text-xs font-bold">Details</button><select value={order.status} onChange={(e) => updateOrder(order.id, e.target.value)} className="border border-slate-300 p-2 text-xs font-bold">{['PENDING','CONFIRMED','PROCESSING','SHIPPED','OUT_FOR_DELIVERY','DELIVERED','CANCELLED','RETURNED','DECLINED','PAYMENT_FAILED','REFUND_PENDING'].map((status) => <option key={status}>{status}</option>)}</select></div></>} />{selected && <Detail title={`Order ${selected.orderNumber || selected.id}`} onClose={() => setSelected(null)}><p>{selected.user?.name} · {selected.user?.email}</p><p className="mt-2">Status: <strong>{selected.status}</strong> · Payment: <strong>{selected.paymentStatus}</strong></p>{selected.paymentStatus === 'CAPTURED' && <button onClick={() => refundOrder(selected.id)} className="mt-4 border border-rose-200 px-3 py-2 text-xs font-black uppercase text-rose-600">Refund via Razorpay</button>}<a href={`/api/admin/orders/${selected.id}/invoice`} className="inline-block mt-4 ml-3 text-xs font-black uppercase text-fuchsia-600 hover:underline">Download invoice</a><div className="mt-4 space-y-2">{(selected.items || []).map((item) => <p key={item.id} className="border-t pt-2 text-sm">{item.productName} × {item.quantity} · ₹{Number(item.totalPrice || item.unitPrice || 0).toLocaleString('en-IN')}</p>)}</div></Detail>}</>;
}

function Coupons({ coupons, onSaved, notify }) {
  const [form, setForm] = useState({ code: '', type: 'PERCENTAGE', value: '', minimumAmount: '', maximumDiscount: '', usageLimit: '', startsAt: '', endsAt: '' });
  const [editingId, setEditingId] = useState(null);
  const save = async (event) => { event.preventDefault(); try { const payload = { ...form, value: Number(form.value), minimumAmount: form.minimumAmount ? Number(form.minimumAmount) : null, maximumDiscount: form.maximumDiscount ? Number(form.maximumDiscount) : null, usageLimit: form.usageLimit ? Number(form.usageLimit) : null, startsAt: new Date(form.startsAt).toISOString(), endsAt: new Date(form.endsAt).toISOString() }; if (editingId) await adminService.updateCoupon(editingId, payload); else await adminService.createCoupon(payload); setForm({ code: '', type: 'PERCENTAGE', value: '', minimumAmount: '', maximumDiscount: '', usageLimit: '', startsAt: '', endsAt: '' }); setEditingId(null); notify('success', 'Coupon Saved', 'Coupon changes are live.'); await onSaved(); } catch (error) { notify('error', 'Coupon Failed', error.message); } };
  const edit = (coupon) => { setEditingId(coupon.id); setForm({ ...coupon, value: String(coupon.value), minimumAmount: coupon.minimumAmount || '', maximumDiscount: coupon.maximumDiscount || '', usageLimit: coupon.usageLimit || '', startsAt: coupon.startsAt?.slice(0, 16) || '', endsAt: coupon.endsAt?.slice(0, 16) || '' }); };
  const remove = async (coupon) => { if (!window.confirm(`Deactivate ${coupon.code}?`)) return; await adminService.deleteCoupon(coupon.id); notify('success', 'Coupon Deactivated', 'Coupon is no longer available.'); await onSaved(); };
  return <div className="space-y-5"><form onSubmit={save} className="bg-white border border-slate-200 p-6 grid md:grid-cols-4 gap-3"><Input label="Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} required /><label className="text-xs font-bold">Type<select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="mt-1 w-full border p-2.5"><option>PERCENTAGE</option><option>FIXED</option></select></label><Input label="Value" type="number" min="0" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} required /><Input label="Minimum order" type="number" min="0" value={form.minimumAmount} onChange={(e) => setForm({ ...form, minimumAmount: e.target.value })} /><Input label="Maximum discount" type="number" min="0" value={form.maximumDiscount} onChange={(e) => setForm({ ...form, maximumDiscount: e.target.value })} /><Input label="Usage limit" type="number" min="1" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} /><Input label="Starts" type="datetime-local" value={form.startsAt} onChange={(e) => setForm({ ...form, startsAt: e.target.value })} required /><Input label="Ends" type="datetime-local" value={form.endsAt} onChange={(e) => setForm({ ...form, endsAt: e.target.value })} required /><button className="bg-slate-950 text-white font-black uppercase text-xs">{editingId ? 'Save coupon' : 'Create coupon'}</button></form><List title="Coupons" items={coupons} render={(coupon) => <><div><strong>{coupon.code}</strong><span className="block text-xs text-slate-500">{coupon.type} · {coupon.value} · {coupon.isActive ? 'Active' : 'Inactive'}</span></div><div className="flex gap-2"><button onClick={() => edit(coupon)} className="border px-2 py-1 text-xs font-bold">Edit</button>{coupon.isActive && <button onClick={() => remove(coupon)} className="border border-rose-200 px-2 py-1 text-xs font-bold text-rose-600">Deactivate</button>}</div></>} /></div>;
}

function Offers({ offers, onSaved, notify }) {
  const [form, setForm] = useState({ name: '', slug: '', description: '', offerType: 'PERCENTAGE', percentage: '', amount: '', startsAt: '', endsAt: '' });
  const [editingId, setEditingId] = useState(null);
  const save = async (event) => { event.preventDefault(); try { const payload = { ...form, percentage: form.percentage ? Number(form.percentage) : null, amount: form.amount ? Number(form.amount) : null, startsAt: new Date(form.startsAt).toISOString(), endsAt: new Date(form.endsAt).toISOString() }; if (editingId) await adminService.updateOffer(editingId, payload); else await adminService.createOffer(payload); setForm({ name: '', slug: '', description: '', offerType: 'PERCENTAGE', percentage: '', amount: '', startsAt: '', endsAt: '' }); setEditingId(null); notify('success', 'Offer Saved', 'Offer changes are live.'); await onSaved(); } catch (error) { notify('error', 'Offer Failed', error.message); } };
  const edit = (offer) => { setEditingId(offer.id); setForm({ ...offer, percentage: offer.percentage || '', amount: offer.amount || '', startsAt: offer.startsAt?.slice(0, 16) || '', endsAt: offer.endsAt?.slice(0, 16) || '' }); };
  const remove = async (offer) => { if (!window.confirm(`Deactivate ${offer.name}?`)) return; await adminService.deleteOffer(offer.id); notify('success', 'Offer Deactivated', 'Offer is no longer visible.'); await onSaved(); };
  return <div className="space-y-5"><form onSubmit={save} className="bg-white border border-slate-200 p-6 grid md:grid-cols-4 gap-3"><Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /><Input label="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required /><label className="text-xs font-bold">Type<select value={form.offerType} onChange={(e) => setForm({ ...form, offerType: e.target.value })} className="mt-1 w-full border p-2.5"><option>PERCENTAGE</option><option>FIXED_AMOUNT</option></select></label><Input label="Percentage" type="number" min="0" max="100" value={form.percentage} onChange={(e) => setForm({ ...form, percentage: e.target.value })} /><Input label="Amount" type="number" min="0" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} /><Input label="Starts" type="datetime-local" value={form.startsAt} onChange={(e) => setForm({ ...form, startsAt: e.target.value })} required /><Input label="Ends" type="datetime-local" value={form.endsAt} onChange={(e) => setForm({ ...form, endsAt: e.target.value })} required /><label className="md:col-span-3 text-xs font-bold">Description<textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1 w-full border p-2.5" /></label><button className="bg-slate-950 text-white font-black uppercase text-xs">{editingId ? 'Save offer' : 'Create offer'}</button></form><List title="Offers" items={offers} render={(offer) => <><div><strong>{offer.name}</strong><span className="block text-xs text-slate-500">{offer.offerType || 'Offer'} · {offer.isActive ? 'Active' : 'Inactive'}</span></div><div className="flex gap-2"><button onClick={() => edit(offer)} className="border px-2 py-1 text-xs font-bold">Edit</button>{offer.isActive && <button onClick={() => remove(offer)} className="border border-rose-200 px-2 py-1 text-xs font-bold text-rose-600">Deactivate</button>}</div></>} /></div>;
}

function Users({ users }) {
  const [selected, setSelected] = useState(null);
  const open = async (user) => { try { const result = await adminService.getUser(user.id); setSelected(result.user); } catch { setSelected(user); } };
  return <><List title="Customers" items={users} render={(user) => <><button onClick={() => open(user)} className="text-left"><strong>{user.name}</strong><p className="text-xs text-slate-500">{user.email} · {user._count?.orders || 0} orders</p></button><span>{user.isActive ? 'Active' : 'Inactive'}</span></>} />{selected && <Detail title={selected.name} onClose={() => setSelected(null)}><p>{selected.email}</p><p className="mt-2">Orders: {selected._count?.orders || selected.orders?.length || 0}</p><div className="mt-4 space-y-2">{(selected.orders || []).map((order) => <p key={order.id} className="border-t pt-2 text-sm">{order.orderNumber} · {order.status} · ₹{Number(order.total || 0).toLocaleString('en-IN')}</p>)}</div></Detail>}</>;
}
function Notifications({ notify }) {
  const [form, setForm] = useState({ type: 'ANNOUNCEMENT', title: '', message: '', link: '' });
  const [saving, setSaving] = useState(false);
  const save = async (event) => { event.preventDefault(); setSaving(true); try { const result = await adminService.createNotification({ audience: 'CUSTOMERS', ...form, link: form.link || null }); notify('success', 'Notification Sent', `${result.sent || 0} customer notifications created.`); setForm({ type: 'ANNOUNCEMENT', title: '', message: '', link: '' }); } catch (error) { notify('error', 'Notification Failed', error.message); } finally { setSaving(false); } };
  return <form onSubmit={save} className="bg-white border border-slate-200 p-6 max-w-2xl space-y-4"><h2 className="font-black uppercase">Notify all customers</h2><Input label="Type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} required /><Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /><label className="text-xs font-bold">Message<textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required rows="5" className="mt-1 w-full border border-slate-300 p-2.5" /></label><Input label="Link (optional)" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} /><button disabled={saving} className="bg-slate-950 text-white p-3 font-black uppercase text-xs disabled:opacity-50">{saving ? 'Sending...' : 'Send notification'}</button></form>;
}
function Detail({ title, onClose, children }) { return <div className="fixed inset-0 z-50 bg-slate-950/50 flex items-center justify-center p-4"><div className="bg-white max-w-xl w-full max-h-[80vh] overflow-auto p-6"><div className="flex justify-between items-center mb-4"><h2 className="font-black uppercase">{title}</h2><button onClick={onClose}><X className="w-5 h-5" /></button></div>{children}</div></div>; }
function List({ title, items, render }) { return <div className="bg-white border border-slate-200 p-6"><h2 className="font-black uppercase mb-4">{title} ({items.length})</h2><div className="divide-y divide-slate-100">{items.length ? items.map((item) => <div key={item.id} className="py-3 flex items-center justify-between gap-4 text-sm">{render(item)}</div>) : <p className="text-sm text-slate-500">No records yet.</p>}</div></div> }
