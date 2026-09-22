// Clean frontend authentication service abstraction.
// Ready to be swapped with backend endpoints:
// POST /api/v1/auth/login
// POST /api/v1/auth/register
// GET /api/v1/auth/me
// POST /api/v1/auth/logout

const STORAGE_KEY = 'takefashion_user_session';

// In-memory fallback / safe session storage (NEVER stores passwords)
function getStoredUser() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Sanitize: ensure no password fields exist
    delete parsed.password;
    delete parsed.confirmPassword;
    return parsed;
  } catch {
    return null;
  }
}

function setStoredUser(user) {
  try {
    if (!user) {
      sessionStorage.removeItem(STORAGE_KEY);
    } else {
      // Never store password
      const { password: _password, confirmPassword: _confirmPassword, ...safeUser } = user;
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(safeUser));
    }
  } catch {
    // Session storage unavailable fallback
  }
}

// Default mock user for testing if needed
const DEMO_USER = {
  id: 'usr_tf_001',
  name: 'Aanya Verma',
  email: 'aanya@example.com',
  phone: '+91 98765 43210',
  memberSince: 'October 2025',
  tier: 'TakeFashion Insider'
};

export const authService = {
  getCurrentUser() {
    return getStoredUser();
  },

  async login({ email, password }) {
    // Simulate brief network latency for realistic UX
    await new Promise((resolve) => setTimeout(resolve, 300));

    const cleanEmail = email?.trim().toLowerCase();
    if (!cleanEmail || !password) {
      throw new Error('Please enter both email and password.');
    }

    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      throw new Error('Please enter a valid email address.');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters.');
    }

    // Determine name from email if not already registered
    const derivedName = cleanEmail.split('@')[0]
      .replace(/[^a-zA-Z]/g, ' ')
      .trim()
      .split(' ')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(' ') || 'Fashion Insider';

    const user = {
      id: `usr_${Date.now()}`,
      name: cleanEmail === DEMO_USER.email ? DEMO_USER.name : derivedName,
      email: cleanEmail,
      phone: cleanEmail === DEMO_USER.email ? DEMO_USER.phone : '+91 98765 00000',
      memberSince: 'March 2026',
      tier: 'TakeFashion Member'
    };

    setStoredUser(user);
    window.dispatchEvent(new CustomEvent('takefashion:auth_change', { detail: user }));
    return user;
  },

  async signup({ name, email, phone, password }) {
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (!name?.trim()) {
      throw new Error('Full name is required.');
    }
    const cleanEmail = email?.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      throw new Error('Please enter a valid email address.');
    }
    if (!phone?.trim() || phone.replace(/\D/g, '').length < 10) {
      throw new Error('Please enter a valid 10-digit mobile number.');
    }
    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    const user = {
      id: `usr_${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      phone: phone.trim(),
      memberSince: 'March 2026',
      tier: 'TakeFashion Member'
    };

    setStoredUser(user);
    window.dispatchEvent(new CustomEvent('takefashion:auth_change', { detail: user }));
    return user;
  },

  logout() {
    setStoredUser(null);
    window.dispatchEvent(new CustomEvent('takefashion:auth_change', { detail: null }));
    return true;
  },

  getMockOrders() {
    return [
      {
        id: 'TF-ORD-98421',
        date: '18 March 2026',
        status: 'Delivered',
        itemsCount: 2,
        total: 3798,
        items: [
          { name: 'Metro Relaxed Oxford Shirt', size: 'M', price: 1599, qty: 1 },
          { name: 'Studio Straight Denim', size: '32', price: 2199, qty: 1 }
        ]
      },
      {
        id: 'TF-ORD-84109',
        date: '02 March 2026',
        status: 'Delivered',
        itemsCount: 1,
        total: 2899,
        items: [
          { name: 'Satin Column Dress', size: 'S', price: 2899, qty: 1 }
        ]
      }
    ];
  },

  getSavedAddresses() {
    return [
      {
        id: 'addr_1',
        title: 'Home',
        isDefault: true,
        recipient: 'Aanya Verma',
        phone: '+91 98765 43210',
        line1: 'Flat 402, Signature Palms, Golf Course Road',
        city: 'Gurugram',
        state: 'Haryana',
        pincode: '122002'
      },
      {
        id: 'addr_2',
        title: 'Work / Studio',
        isDefault: false,
        recipient: 'Aanya Verma',
        phone: '+91 98765 43210',
        line1: 'TakeFashion Creative Studio, 3rd Floor, Cyber City',
        city: 'Gurugram',
        state: 'Haryana',
        pincode: '122002'
      }
    ];
  }
};
