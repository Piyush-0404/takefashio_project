import { apiClient } from './apiClient';

export const notificationService = {
  list: () => apiClient.get('/api/notifications'),
  markRead: (id) => apiClient.patch(`/api/notifications/${id}`, {}),
  markAllRead: () => apiClient.post('/api/notifications/read-all'),
};