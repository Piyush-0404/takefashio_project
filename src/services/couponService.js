import { apiClient } from './apiClient';

export const couponService = {
  async validateCoupon(rawCode, subtotal) {
    if (!rawCode || typeof rawCode !== 'string') {
      return { valid: false, message: 'Please enter a coupon code.' };
    }

    const code = rawCode.trim().toUpperCase();
    try {
      const payload = await apiClient.post('/api/coupons/validate', { code, subtotal });
      return {
        valid: true,
        code: payload?.code || code,
        discount: Number(payload?.discount || 0),
        message: `Coupon "${payload?.code || code}" applied successfully!`
      };
    } catch (error) {
      return { valid: false, message: error.message || 'Coupon is invalid or expired.' };
    }
  }
};

