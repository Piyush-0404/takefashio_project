import { apiClient } from './apiClient';

export const wishlistService = {
  async getWishlist() {
    const payload = await apiClient.get('/api/wishlist');
    return Array.isArray(payload?.items)
      ? payload.items.map((item) => ({
          wishlistItemId: item.id,
          productId: item.productId || item.product?.id,
          product: item.product,
        }))
      : [];
  },

  async addItem(productId) {
    return apiClient.post('/api/wishlist/items', { productId });
  },

  async removeItem(itemId) {
    return apiClient.remove(`/api/wishlist/items/${itemId}`);
  },

  async clearWishlist() {
    return apiClient.remove('/api/wishlist');
  },
};
