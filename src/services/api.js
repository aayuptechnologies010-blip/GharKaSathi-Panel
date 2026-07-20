const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://gharkasathi-backend.onrender.com/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('admin_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || data.error || 'Something went wrong');
  }

  return data;
}

export const api = {
  login: (email, password) =>
    request('/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  getCategories: () =>
    request('/categories', {
      method: 'GET',
    }),
  createCategory: (data) =>
    request('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateCategory: (id, data) =>
    request(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteCategory: (id) =>
    request(`/categories/${id}`, {
      method: 'DELETE',
    }),
  getUsers: () =>
    request('/admin/users', {
      method: 'GET',
    }),
  suspendUser: (id) =>
    request(`/admin/users/${id}/suspend`, {
      method: 'PUT',
    }),
  reinstateUser: (id) =>
    request(`/admin/users/${id}/reinstate`, {
      method: 'PUT',
    }),
  getProviders: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/admin/providers${query ? '?' + query : ''}`, {
      method: 'GET',
    });
  },
  approveProvider: (id) =>
    request(`/admin/providers/${id}/approve`, {
      method: 'PUT',
    }),
  suspendProvider: (id) =>
    request(`/admin/providers/${id}/suspend`, {
      method: 'PUT',
    }),
  reinstateProvider: (id) =>
    request(`/admin/providers/${id}/reinstate`, {
      method: 'PUT',
    }),
  getComplaints: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/admin/complaints${query ? '?' + query : ''}`, {
      method: 'GET',
    });
  },
  resolveComplaint: (id, data) =>
    request(`/admin/complaints/${id}/resolve`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  getAnalytics: () =>
    request('/admin/analytics', {
      method: 'GET',
    }),
  getPayments: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/admin/payments${query ? '?' + query : ''}`, {
      method: 'GET',
    });
  },
  getPaymentSummary: () =>
    request('/admin/payments/summary', {
      method: 'GET',
    }),
  getBookings: () =>
    request('/bookings', {
      method: 'GET',
    }),
};
