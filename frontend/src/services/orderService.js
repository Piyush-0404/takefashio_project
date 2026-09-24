import { apiClient } from './apiClient';

export const orderService = {
  async listOrders() {
    const payload = await apiClient.get('/api/orders');
    return payload?.orders || [];
  },

  async createOrder(shippingAddress, items = null, couponCode = null) {
    return apiClient.post('/api/orders', { shippingAddress, ...(items ? { items } : {}), ...(couponCode ? { couponCode } : {}), paymentMethod: 'RAZORPAY', checkoutId: crypto.randomUUID() });
  },
  async createCashOrder(shippingAddress, items = null, couponCode = null) {
    return apiClient.post('/api/orders', { shippingAddress, ...(items ? { items } : {}), ...(couponCode ? { couponCode } : {}), paymentMethod: 'COD', checkoutId: crypto.randomUUID() });
  },
  createPaymentOrder: (orderId) => apiClient.post('/api/payments/create-order', { orderId }),
  verifyPayment: (payload) => apiClient.post('/api/payments/verify', payload),
  invoiceUrl(orderId) {
    return `/api/orders/${orderId}/invoice`;
  },
};
