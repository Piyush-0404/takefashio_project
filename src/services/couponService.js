// Isolated coupon service with mock demo codes
// Ready for future integration with /api/v1/coupons/validate

const VALID_COUPONS = {
  'TAKEFASHION20': {
    code: 'TAKEFASHION20',
    type: 'percentage',
    value: 20,
    minSpend: 999,
    description: '20% OFF on all TakeFashion orders above ₹999'
  },
  'FIRSTLOOK15': {
    code: 'FIRSTLOOK15',
    type: 'percentage',
    value: 15,
    minSpend: 500,
    description: '15% OFF for new season fashion discoveries'
  },
  'STYLE500': {
    code: 'STYLE500',
    type: 'flat',
    value: 500,
    minSpend: 2499,
    description: 'Flat ₹500 OFF on orders above ₹2,499'
  }
};

export const couponService = {
  validateCoupon(rawCode, subtotal) {
    if (!rawCode || typeof rawCode !== 'string') {
      return { valid: false, message: 'Please enter a coupon code.' };
    }

    const code = rawCode.trim().toUpperCase();
    const coupon = VALID_COUPONS[code];

    if (!coupon) {
      return {
        valid: false,
        message: 'Invalid code. Try "TAKEFASHION20" for 20% off.'
      };
    }

    if (subtotal < coupon.minSpend) {
      return {
        valid: false,
        message: `Add ₹${coupon.minSpend - subtotal} more to use code "${coupon.code}".`
      };
    }

    const discount = coupon.type === 'percentage'
      ? Math.round(subtotal * (coupon.value / 100))
      : Math.min(subtotal, coupon.value);

    return {
      valid: true,
      code: coupon.code,
      discount,
      description: coupon.description,
      message: `Coupon "${coupon.code}" applied successfully!`
    };
  },

  getAvailableCoupons() {
    return Object.values(VALID_COUPONS);
  }
};

