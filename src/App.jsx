import React, { useState, useCallback } from 'react';
import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom';
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
import AccountPage from './pages/AccountPage';
import Toast from './components/ui/Toast';
import { ALL_PRODUCTS } from './catalog';

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
  const [cart, setCart] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutTotals, setCheckoutTotals] = useState({ subtotal: 0, discount: 0, shipping: 0, grandTotal: 0 });
  const [toast, setToast] = useState(null);

  const showToast = useCallback((toastData) => {
    setToast(toastData);
  }, []);

  const toggleWishlist = useCallback((productId) => {
    const product = ALL_PRODUCTS.find((p) => p.id === productId);
    setWishlistIds((prev) => {
      const exists = prev.includes(productId);
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
  }, [showToast]);

  const handleAddToCart = useCallback((product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    showToast({
      type: 'cart',
      title: 'Added to Bag',
      message: `"${product.name}" has been added to your shopping bag.`
    });
  }, [showToast]);

  const handleUpdateCartQuantity = useCallback((productId, quantity) => {
    setCart((prev) =>
      quantity <= 0 ? prev.filter((item) => item.id !== productId) : prev.map((item) => item.id === productId ? { ...item, quantity } : item)
    );
  }, []);

  const handleRemoveCartItem = useCallback((productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
    showToast({
      type: 'info',
      title: 'Item Removed',
      message: 'Item removed from shopping bag.'
    });
  }, [showToast]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const sharedProps = {
    onProductClick: setSelectedProduct,
    onAddToCart: handleAddToCart,
    onToggleWishlist: toggleWishlist,
    wishlistIds,
    onShowToast: showToast
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fffafc] text-slate-950 font-sans selection:bg-pink-100 selection:text-pink-900">
      <Header
        cartCount={cartCount}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      <main className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              <HomeSections
                products={ALL_PRODUCTS}
                onProductClick={setSelectedProduct}
                onAddToCart={handleAddToCart}
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
          <Route path="/account" element={<AccountPage {...sharedProps} />} />
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
        onToggleWishlist={toggleWishlist}
        isWishlisted={selectedProduct ? wishlistIds.includes(selectedProduct.id) : false}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={(totals) => {
          setCheckoutTotals(totals);
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        totals={checkoutTotals}
        onClearCart={() => setCart([])}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        products={ALL_PRODUCTS}
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
