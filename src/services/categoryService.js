import { apiClient } from './apiClient';

export const categoryService = {
  async listCategories() {
    const payload = await apiClient.get('/api/categories');
    return payload?.categories || [];
  },

  async listChildren(slug) {
    const payload = await apiClient.get(`/api/categories/${slug}/children`);
    return payload?.categories || [];
  },
};
