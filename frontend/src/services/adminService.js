import { apiClient, apiRequest } from './apiClient';
import { broadcastCatalogUpdate } from './catalogSync';

const emitMutation = async (request, entity, action, transform = (result) => result) => {
  const result = await request();
  const eventPayload = transform(result) || {};
  broadcastCatalogUpdate(entity, action, eventPayload);
  return result;
};

export const adminService = {
  getDashboard: () => apiClient.get('/api/admin/dashboard'),
  getAnalytics: (query = {}) => apiClient.get('/api/admin/analytics/overview', query),
  getProducts: () => apiClient.get('/api/admin/products'),
  createProduct: (product) => emitMutation(() => apiClient.post('/api/admin/products', product), 'product', 'created', (result) => result?.product || {}),
  updateProduct: (id, product) => emitMutation(() => apiClient.patch(`/api/admin/products/${id}`, product), 'product', 'updated', (result) => result?.product || { id }),
  deleteProduct: (id) => emitMutation(() => apiClient.remove(`/api/admin/products/${id}`), 'product', 'deleted', (result) => result?.product || { id }),
  getCategories: () => apiClient.get('/api/admin/categories'),
  createCategory: (category) => emitMutation(() => apiClient.post('/api/admin/categories', category), 'category', 'created', (result) => result?.category || {}),
  updateCategory: (id, category) => emitMutation(() => apiClient.patch(`/api/admin/categories/${id}`, category), 'category', 'updated', (result) => result?.category || { id }),
  deleteCategory: (id) => emitMutation(() => apiClient.remove(`/api/admin/categories/${id}`), 'category', 'deleted', (result) => result?.category || { id }),
  getOrders: () => apiClient.get('/api/admin/orders'),
  getOrder: (id) => apiClient.get(`/api/admin/orders/${id}`),
  updateOrder: (id, status) => emitMutation(() => apiClient.patch(`/api/admin/orders/${id}`, { status }), 'order', 'updated', (result) => result?.order || { id, status }),
  refundOrder: (id, amount) => apiClient.post(`/api/admin/orders/${id}/refund`, amount ? { amount } : {}),
  getCoupons: () => apiClient.get('/api/admin/coupons'),
  createCoupon: (coupon) => emitMutation(() => apiClient.post('/api/admin/coupons', coupon), 'coupon', 'created', (result) => result?.coupon || {}),
  updateCoupon: (id, coupon) => emitMutation(() => apiClient.patch(`/api/admin/coupons/${id}`, coupon), 'coupon', 'updated', (result) => result?.coupon || { id }),
  deleteCoupon: (id) => emitMutation(() => apiClient.remove(`/api/admin/coupons/${id}`), 'coupon', 'deleted', (result) => result?.coupon || { id }),
  getOffers: () => apiClient.get('/api/admin/offers'),
  createOffer: (offer) => emitMutation(() => apiClient.post('/api/admin/offers', offer), 'offer', 'created', (result) => result?.offer || {}),
  updateOffer: (id, offer) => emitMutation(() => apiClient.patch(`/api/admin/offers/${id}`, offer), 'offer', 'updated', (result) => result?.offer || { id }),
  deleteOffer: (id) => emitMutation(() => apiClient.remove(`/api/admin/offers/${id}`), 'offer', 'deleted', (result) => result?.offer || { id }),
  getUsers: () => apiClient.get('/api/admin/users'),
  getUser: (id) => apiClient.get(`/api/admin/users/${id}`),
  createNotification: (notification) => apiClient.post('/api/admin/notifications', notification),
  uploadImage: (file) => {
    const body = new FormData();
    body.append('file', file);
    return apiRequest('/api/admin/uploads', { method: 'POST', body });
  },
};
