// Base URL of the backend
const API_BASE = 'http://localhost:5000/api';

// ── Token helpers ─────────────────────────────────────────────────────────
export const saveToken  = (token) => localStorage.setItem('cricket_ai_token', token);
export const getToken   = ()      => localStorage.getItem('cricket_ai_token');
export const removeToken= ()      => localStorage.removeItem('cricket_ai_token');

// ── Generic fetch wrapper ─────────────────────────────────────────────────
async function request(endpoint, options = {}) {
  const token = getToken();

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  const data     = await response.json();

  if (!response.ok) {
    // Throw the server's error message so UI can display it
    throw new Error(data.message || data.errors?.[0]?.msg || 'Something went wrong.');
  }

  return data;
}

// ── Auth API ──────────────────────────────────────────────────────────────

export const authAPI = {
  // Register new account
  register: (name, email, password, role) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    }),

  // Login
  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  // Get current logged-in user (needs token)
  getMe: () => request('/auth/me'),

  // Update profile name
  updateProfile: (name) =>
    request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify({ name }),
    }),

  // Change password
  changePassword: (currentPassword, newPassword) =>
    request('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    }),
};
