import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data: { name?: string; email?: string }) =>
    api.put('/auth/profile', data),
};

// Products API
export const productsApi = {
  getAll: (params?: { category?: string; search?: string; page?: number; limit?: number }) =>
    api.get('/products', { params }),
  getById: (id: string) => api.get(`/products/${id}`),
  create: (data: FormData) =>
    api.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id: string, data: FormData) =>
    api.put(`/products/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id: string) => api.delete(`/products/${id}`),
};

// Cart API
export const cartApi = {
  get: () => api.get('/cart'),
  add: (productId: string, quantity: number) =>
    api.post('/cart', { productId, quantity }),
  update: (productId: string, quantity: number) =>
    api.put('/cart', { productId, quantity }),
  remove: (productId: string) => api.delete(`/cart/${productId}`),
  clear: () => api.delete('/cart'),
};

// Orders API
export const ordersApi = {
  create: (data: { shippingAddress: object; paymentMethod: string }) =>
    api.post('/orders', data),
  getAll: () => api.get('/orders'),
  getById: (id: string) => api.get(`/orders/${id}`),
  updateStatus: (id: string, status: string) =>
    api.put(`/orders/${id}/status`, { status }),
};

// Payments API
export const paymentsApi = {
  createOrder: (orderId: string) => api.post('/payments/create', { orderId }),
  verify: (data: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) =>
    api.post('/payments/verify', data),
};

// Admin API
export const adminApi = {
  getUsers: () => api.get('/admin/users'),
  updateUserRole: (userId: string, role: string) =>
    api.put(`/admin/users/${userId}/role`, { role }),
  deleteUser: (userId: string) => api.delete(`/admin/users/${userId}`),
  getAllOrders: () => api.get('/admin/orders'),
  getAnalytics: () => api.get('/admin/analytics'),
};
