import React, { useState, useCallback, useEffect } from 'react';
import { BrowserRouter, Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './components/layout/Footer';
import HomeSections from './HomeSections';
import CategoryPage from './CategoryPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ProductDetailModal from './ProductDetailModal';
import CartDrawer from './CartDrawer';
import CheckoutModal from './CheckoutModal';
import SearchModal from './SearchModal';
import OffersPage from './pages/OffersPage';
import WishlistPage from './pages/WishlistPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import AccountPage from './pages/AccountPage';
import AdminPage from './pages/AdminPage';
import Toast from './components/ui/Toast';
import { listProducts } from './services/productService';
import { categoryService } from './services/categoryService';
import { authService } from './services/authService';
import { cartService } from './services/cartService';
import { wishlistService } from './services/wishlistService';
import { subscribeCatalogUpdates } from './services/catalogSync';
import { notificationService } from './services/notificationService';

function MissingPage() {
  return (
    <section className="max-w-3xl mx-auto px-4 md:px-8 py-28 text-center">
      <p className="text-xs font-black uppercase tracking-[0.25em] text-fuchsia-600 mb-2">404 Error</p>
      <h1 className="text-4xl md:text-6xl font-black text-slate-950 uppercase tracking-tight">Page Not Found</h1>
      <p className="mt-3 text-slate-500 text-sm max-w-md mx-auto">
        The page you are looking for might have been moved or does not exist. Explore our latest fashion edits instead.
      </p>
      <Link
        to="/"
        className="inline-block mt-8 px-6 py-3.5 bg-slate-950 text-white font-black uppercase tracking-wider text-xs rounded-xs hover:bg-fuchsia-600 transition shadow-md"
      >
        Return to Home
      </Link>
    </section>
  );
}

function Storefront() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [wishlistItemIds, setWishlistItemIds] = useState({});
  const [catalogProducts, setCatalogProducts] = useState([]);
  const [catalogCategories, setCatalogCategories] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [directPurchase, setDirectPurchase] = useState(null);
  const [checkoutTotals, setCheckoutTotals] = useState({ subtotal: 0, discount: 0, shipping: 0, grandTotal: 0 });
  const [toast, setToast] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const storefrontProducts = catalogProducts;

  useEffect(() => {
    let active = true;

    const loadCatalog = async () => {
      try {
        const [result, categories] = await Promise.all([
          listProducts({ page: 1, limit: 50 }),
          categoryService.listCategories(),
        ]);
        if (!active) return;
        setCatalogProducts(Array.isArray(result?.products) ? result.products : []);
        setCatalogCategories(Array.isArray(categories) ? categories : []);
      } catch (error) {
        if (!active) return;
        setCatalogProducts([]);
        setCatalogCategories([]);
      }
    };

    loadCatalog();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!authService.getCurrentUser()) return undefined;
    let active = true;
    const loadNotifications = () => notificationService.list().then((result) => {
      if (!active) return;
      setNotifications(result.notifications || []);
      setUnreadNotifications(result.unread || 0);
    }).catch(() => undefined);
    loadNotifications();
    const handler = () => loadNotifications();
    window.addEventListener('takefashion:notification', handler);
    const interval = window.setInterval(loadNotifications, 30000);
    window.addEventListener('focus', loadNotifications);
    return () => { active = false; window.clearInterval(interval); window.removeEventListener('focus', loadNotifications); window.removeEventListener('takefashion:notification', handler); };
  }, []);

  useEffect(() => {
    const refreshCatalog = () => {
      listProducts({ page: 1, limit: 50 })
        .then((result) => setCatalogProducts(Array.isArray(result?.products) ? result.products : []))
        .catch(() => undefined);

      categoryService.listCategories()
        .then((categories) => setCatalogCategories(Array.isArray(categories) ? categories : []))
        .catch(() => undefined);
    };

    const unsubscribe = subscribeCatalogUpdates(() => refreshCatalog());
    window.addEventListener('focus', refreshCatalog);
    const interval = window.setInterval(refreshCatalog, 30000);
    return () => {
      unsubscribe();
      window.removeEventListener('focus', refreshCatalog);
      window.clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const handleAuthChange = async (event) => {
      if (!event.detail) return;
      const pending = sessionStorage.getItem('takefashion_pending_action');
      if (!pending) return;
      sessionStorage.removeItem('takefashion_pending_action');
      const action = JSON.parse(pending);
      if (action.type === 'buy_now') {
        const product = storefrontProducts.find((item) => item.id === action.productId);
        if (product) {
          setDirectPurchase({ product, productVariantId: action.productVariantId, quantity: action.quantity });
          setCheckoutTotals({ subtotal: product.price * action.quantity, discount: 0, shipping: product.price * action.quantity >= 999 ? 0 : 49, grandTotal: product.price * action.quantity + (product.price * action.quantity >= 999 ? 0 : 49) });
          setIsCheckoutOpen(true);
        }
      } else if (action.type === 'checkout') {
        const result = await cartService.getCart();
        setCart(result.cart.items);
        if (result.cart.items.length) setIsCheckoutOpen(true);
      } else if (action.type === 'add_to_cart') {
        await handleAddToCart(storefrontProducts.find((item) => item.id === action.productId));
        const result = await cartService.getCart();
        setCart(result.cart.items);
      }
    };
    window.addEventListener('takefashion:auth_change', handleAuthChange);
    return () => window.removeEventListener('takefashion:auth_change', handleAuthChange);
  }, [storefrontProducts]);

  useEffect(() => {
    let active = true;
    authService.refreshSession().catch(() => undefined);
    if (!authService.getCurrentUser()) return undefined;

    cartService.getCart()
      .then((result) => {
        if (active) setCart(result.cart.items);
      })
      .catch(() => {
        // Keep the local cart available when a session cannot be restored.
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    if (!authService.getCurrentUser()) return undefined;

    wishlistService.getWishlist()
      .then((items) => {
        if (!active) return;
        setWishlistIds(items.map((item) => item.productId));
        setWishlistItemIds(Object.fromEntries(items.map((item) => [item.productId, item.wishlistItemId])));
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, []);

  const showToast = useCallback((toastData) => {
    setToast(toastData);
  }, []);

  const toggleWishlist = useCallback(async (productId) => {
    const product = storefrontProducts.find((p) => p.id === productId);
    const exists = wishlistIds.includes(productId);

    if (authService.getCurrentUser()) {
      try {
        if (exists) {
          await wishlistService.removeItem(wishlistItemIds[productId]);
          setWishlistItemIds((current) => {
            const next = { ...current };
            delete next[productId];
            return next;
          });
        } else {
          const payload = await wishlistService.addItem(productId);
          setWishlistItemIds((current) => ({ ...current, [productId]: payload?.item?.id }));
        }
      } catch (error) {
        showToast({ type: 'error', title: 'Unable to update wishlist', message: error.message });
        return;
      }
    }

    setWishlistIds((prev) => {
      if (exists) {
        showToast({
          type: 'info',
          title: 'Removed from Wishlist',
          message: product ? `"${product.name}" removed from wishlist.` : 'Item removed from wishlist.'
        });
        return prev.filter((id) => id !== productId);
      } else {
        showToast({
          type: 'wishlist',
          title: 'Saved to Wishlist',
          message: product ? `"${product.name}" added to your wishlist.` : 'Item added to wishlist.'
        });
        return [...prev, productId];
      }
    });
  }, [showToast, storefrontProducts, wishlistIds, wishlistItemIds]);

  const handleAddToCart = useCallback(async (product) => {
    if (!authService.getCurrentUser()) {
      sessionStorage.setItem('takefashion_pending_action', JSON.stringify({ type: 'add_to_cart', productId: product.id }));
      navigate('/login', { state: { from: { pathname: '/' } } });
      return;
    }
    if (product?.id) {
      try {
        await cartService.addItem(product.id, 1, product.productVariantId);
      } catch (error) {
        showToast({ type: 'error', title: 'Unable to add to bag', message: error.message });
        return;
      }
    }

    const refreshed = await cartService.getCart();
    setCart(refreshed.cart.items);
    showToast({
      type: 'cart',
      title: 'Added to Bag',
      message: `"${product.name}" has been added to your shopping bag.`
    });
  }, [navigate, showToast]);

  const handleBuyNow = useCallback((product, quantity = 1) => {
    if (!authService.getCurrentUser()) {
      sessionStorage.setItem('takefashion_pending_action', JSON.stringify({ type: 'buy_now', productId: product.id, productVariantId: product.productVariantId, quantity }));
      navigate('/login', { state: { from: { pathname: '/' } } });
      return;
    }
    const subtotal = product.price * quantity;
    const shipping = subtotal >= 999 ? 0 : 49;
    setDirectPurchase({ product, productVariantId: product.productVariantId, quantity });
    setCheckoutTotals({ subtotal, discount: 0, shipping, grandTotal: subtotal + shipping });
    setIsCheckoutOpen(true);
  }, [navigate]);

  const openCheckout = useCallback(async (totals) => {
    if (!authService.getCurrentUser()) {
      sessionStorage.setItem('takefashion_pending_action', JSON.stringify({ type: 'checkout' }));
      setIsCartOpen(false);
      navigate('/login', { state: { from: { pathname: '/' } } });
      return;
    }
    const result = await cartService.getCart();
    if (!result.cart.items.length) {
      showToast({ type: 'error', title: 'Cart is empty', message: 'Add a product before continuing to checkout.' });
      return;
    }
    setCart(result.cart.items);
    setDirectPurchase(null);
    setCheckoutTotals(totals);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  }, [navigate, showToast]);

  const handleUpdateCartQuantity = useCallback(async (productId, quantity) => {
    const item = cart.find((cartItem) => cartItem.id === productId);
    if (authService.getCurrentUser() && item?.cartItemId) {
      try {
        if (quantity <= 0) await cartService.removeItem(item.cartItemId);
        else await cartService.updateItem(item.cartItemId, quantity);
      } catch (error) {
        showToast({ type: 'error', title: 'Unable to update bag', message: error.message });
        return;
      }
    }
    setCart((prev) =>
      quantity <= 0 ? prev.filter((item) => item.id !== productId) : prev.map((item) => item.id === productId ? { ...item, quantity } : item)
    );
  }, [cart, showToast]);

  const handleRemoveCartItem = useCallback(async (productId) => {
    const item = cart.find((cartItem) => cartItem.id === productId);
    if (authService.getCurrentUser() && item?.cartItemId) {
      try {
        await cartService.removeItem(item.cartItemId);
      } catch (error) {
        showToast({ type: 'error', title: 'Unable to remove item', message: error.message });
        return;
      }
    }
    setCart((prev) => prev.filter((item) => item.id !== productId));
    showToast({
      type: 'info',
      title: 'Item Removed',
      message: 'Item removed from shopping bag.'
    });
  }, [cart, showToast]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const sharedProps = {
    onProductClick: setSelectedProduct,
    onAddToCart: handleAddToCart,
    onBuyNow: handleBuyNow,
    onToggleWishlist: toggleWishlist,
    wishlistIds,
    onShowToast: showToast,
    products: storefrontProducts,
    categories: catalogCategories,
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fffafc] text-slate-950 font-sans selection:bg-pink-100 selection:text-pink-900">
      <Header
        cartCount={cartCount}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        notifications={notifications}
        unreadNotifications={unreadNotifications}
        onMarkNotificationRead={async (id) => { await notificationService.markRead(id); setNotifications((items) => items.map((item) => item.id === id ? { ...item, readAt: new Date().toISOString() } : item)); setUnreadNotifications((count) => Math.max(0, count - 1)); }}
        onMarkAllNotificationsRead={async () => { await notificationService.markAllRead(); setNotifications((items) => items.map((item) => ({ ...item, readAt: item.readAt || new Date().toISOString() }))); setUnreadNotifications(0); }}
      />

      <main className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              <HomeSections
                products={storefrontProducts}
                categories={catalogCategories}
                onProductClick={setSelectedProduct}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
                onToggleWishlist={toggleWishlist}
                wishlistIds={wishlistIds}
              />
            }
          />
          <Route path="/men/*" element={<CategoryPage {...sharedProps} />} />
          <Route path="/women/*" element={<CategoryPage {...sharedProps} />} />
          <Route path="/kids/*" element={<CategoryPage {...sharedProps} />} />
          <Route path="/jewellery/*" element={<CategoryPage {...sharedProps} />} />
          <Route path="/accessories/*" element={<CategoryPage {...sharedProps} />} />
          <Route path="/product/:id" element={<ProductDetailPage {...sharedProps} />} />
          <Route path="/offers" element={<OffersPage {...sharedProps} />} />
          <Route path="/wishlist" element={<WishlistPage {...sharedProps} />} />
          <Route path="/login" element={<LoginPage onShowToast={showToast} />} />
          <Route path="/signup" element={<SignupPage onShowToast={showToast} />} />
          <Route path="/verify-email" element={<VerifyEmailPage onShowToast={showToast} />} />
          <Route path="/account" element={<AccountPage {...sharedProps} />} />
          <Route path="/admin" element={<AdminPage onShowToast={showToast} />} />
          <Route path="/:categorySlug/*" element={<CategoryPage {...sharedProps} />} />
          <Route path="/404" element={<MissingPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </main>

      <Footer
        onNewsletterSubmit={() =>
          showToast({
            type: 'success',
            title: 'Subscribed',
            message: 'You have subscribed to the TakeFashion weekly edit!'
          })
        }
      />

      {/* Modals and Drawers */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        onToggleWishlist={toggleWishlist}
        isWishlisted={selectedProduct ? wishlistIds.includes(selectedProduct.id) : false}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
                onProceedToCheckout={openCheckout}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        totals={checkoutTotals}
        directPurchase={directPurchase}
        onClearCart={async () => {
          setCart([]);
          setDirectPurchase(null);
          const result = await cartService.getCart().catch(() => ({ cart: { items: [] } }));
          setCart(result.cart.items);
        }}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        products={storefrontProducts}
        onSelectProduct={setSelectedProduct}
      />

      {/* Global Floating Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Storefront />
    </BrowserRouter>
  );
}
