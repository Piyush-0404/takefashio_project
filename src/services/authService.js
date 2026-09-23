import { apiClient, ApiError } from './apiClient';

const STORAGE_KEY = 'takefashion_user_session';

function getStoredUser() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
}

function setStoredUser(user) {
  try {
    if (!user) {
      sessionStorage.removeItem(STORAGE_KEY);
      return;
    }
    const { password: _password, confirmPassword: _confirmPassword, ...safeUser } = user;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(safeUser));
  } catch {
    // no-op if storage is unavailable
  }
}

function notifyAuthChange(user) {
  window.dispatchEvent(new CustomEvent('takefashion:auth_change', { detail: user }));
}

export const authService = {
  getCurrentUser() {
    return getStoredUser();
  },

  async refreshSession() {
    try {
      const payload = await apiClient.get('/api/auth/me');
      const user = payload?.user || null;
      setStoredUser(user);
      notifyAuthChange(user);
      return user;
    } catch (error) {
      setStoredUser(null);
      notifyAuthChange(null);
      if (error instanceof ApiError && error.status === 401) return null;
      throw error;
    }
  },

  async login({ email, password }) {
    const cleanedEmail = String(email || '').trim().toLowerCase();
    if (!cleanedEmail || !String(password || '').length) {
      throw new Error('Please enter both email and password.');
    }

    const payload = await apiClient.post('/api/auth/login', { email: cleanedEmail, password });
    const user = payload?.user || null;
    setStoredUser(user);
    notifyAuthChange(user);
    return user;
  },

  async signup({ name, email, phone, password }) {
    const payload = await apiClient.post('/api/auth/register', {
      name: String(name || '').trim(),
      email: String(email || '').trim().toLowerCase(),
      password,
      phone,
    });
    return payload;
  },

  async verifyEmail(email, otp) {
    return apiClient.post('/api/auth/verify-email', { email, otp });
  },

  async resendVerification(email) {
    return apiClient.post('/api/auth/resend-verification', { email });
  },

  async logout() {
    try {
      await apiClient.post('/api/auth/logout');
    } catch (error) {
      if (!(error instanceof ApiError && error.status === 401)) {
        throw error;
      }
    } finally {
      setStoredUser(null);
      notifyAuthChange(null);
    }
    return true;
  },
};
