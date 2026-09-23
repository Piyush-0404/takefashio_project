import { apiClient } from './apiClient';

function normalizeCartItem(item) {
  const product = item?.product || {};
  return {
    id: product?.id || item?.productId,
    cartItemId: item?.id,
    productId: product?.id,
    name: product?.name,
    price: Number(product?.price || 0),
    originalPrice: Number(product?.price || 0),
    quantity: Number(item?.quantity || 1),
    heroImage: product?.imageUrl || product?.productImages?.[0]?.imageUrl || '',
    category: product?.category?.name || product?.category || '',
    subcategory: product?.category?.name || product?.subcategory || '',
    size: item?.productVariant?.size,
    color: item?.productVariant?.color,
    productVariantId: item?.productVariantId,
  };
}

export const cartService = {
  async getCart() {
    const payload = await apiClient.get('/api/cart');
    const items = Array.isArray(payload?.cart?.items) ? payload.cart.items.map(normalizeCartItem) : [];
    return { cart: { ...payload.cart, items } };
  },

  async addItem(productId, quantity = 1, productVariantId) {
    return apiClient.post('/api/cart/items', { productId, quantity, ...(productVariantId ? { productVariantId } : {}) });
  },

  async updateItem(itemId, quantity) {
    return apiClient.patch(`/api/cart/items/${itemId}`, { quantity });
  },

  async removeItem(itemId) {
    return apiClient.remove(`/api/cart/items/${itemId}`);
  },

  async clearCart() {
    return apiClient.remove('/api/cart');
  },
};
