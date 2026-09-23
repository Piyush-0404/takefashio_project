import { apiClient } from './apiClient';

export const addressService = {
  async listAddresses() {
    const payload = await apiClient.get('/api/addresses');
    return payload?.addresses || [];
  },

  async createAddress(address) {
    return apiClient.post('/api/addresses', toBackendAddress(address));
  },

  async updateAddress(id, address) {
    return apiClient.patch(`/api/addresses/${id}`, toBackendAddress(address));
  },

  async deleteAddress(id) {
    return apiClient.remove(`/api/addresses/${id}`);
  },
};

function toBackendAddress(address) {
  return {
    fullName: address.fullName || address.name,
    phone: address.phone,
    addressLine1: address.addressLine1 || address.line1,
    addressLine2: address.addressLine2 || address.line2,
    city: address.city,
    state: address.state,
    postalCode: address.postalCode || address.pincode,
    country: address.country || 'India',
    isDefault: address.isDefault,
  };
}
