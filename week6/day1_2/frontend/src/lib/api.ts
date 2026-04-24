import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request if present
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    let token = localStorage.getItem('shopco_token');
    
    // Fallback to Zustand persisted state if shopco_token is somehow missing
    if (!token) {
      const authStorage = localStorage.getItem('shopco-auth');
      if (authStorage) {
        try {
          const parsed = JSON.parse(authStorage);
          token = parsed?.state?.token;
        } catch (e) {}
      }
    }

    if (token) {
      // Remove quotes in case it was stringified incorrectly
      token = token.replace(/^"(.*)"$/, '$1');
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ─── Auth ──────────────────────────────
export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// ─── Products ──────────────────────────
export const productsApi = {
  getAll: (params?: Record<string, any>) => api.get('/products', { params }),
  getNewArrivals: (limit = 4) => api.get('/products/new-arrivals', { params: { limit } }),
  getTopSelling: (limit = 4) => api.get('/products/top-selling', { params: { limit } }),
  getOnSale: (limit = 12) => api.get('/products/on-sale', { params: { limit } }),
  getOne: (id: string) => api.get(`/products/${id}`),
  getRelated: (id: string) => api.get(`/products/${id}/related`),
};

// ─── Categories ────────────────────────
export const categoriesApi = {
  getAll: () => api.get('/categories'),
};

// ─── Cart ──────────────────────────────
export const cartApi = {
  getCart: () => api.get('/cart'),
  addItem: async (data: { productId: string; quantity: number; size: string; color: string }) => {
    let token = '';
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('shopco_token') || '';
      if (!token) {
        const authStorage = localStorage.getItem('shopco-auth');
        if (authStorage) {
          try {
            token = JSON.parse(authStorage)?.state?.token || '';
          } catch (e) {}
        }
      }
      token = token.replace(/^"(.*)"$/, '$1');
    }

    const payload = {
      productId: String(data.productId),
      quantity: Number(data.quantity),
      size: String(data.size),
      color: String(data.color),
    };

    return axios.post(`${API_URL}/cart/add`, payload, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  },
  updateItem: (itemId: string, quantity: number) =>
    api.patch(`/cart/update/${itemId}`, { quantity }),
  removeItem: (itemId: string) => api.delete(`/cart/remove/${itemId}`),
  clearCart: () => api.delete('/cart/clear'),
};

// ─── Orders ────────────────────────────
export const ordersApi = {
  createOrder: (data: any) => api.post('/orders', data),
  getMyOrders: () => api.get('/orders/my-orders'),
  getOrderById: (id: string) => api.get(`/orders/${id}`),
};

// ─── Reviews ───────────────────────────
export const reviewsApi = {
  getProductReviews: (productId: string, page = 1, limit = 6) =>
    api.get(`/reviews/${productId}`, { params: { page, limit } }),
  createReview: (productId: string, data: { rating: number; comment: string; userName: string }) =>
    api.post(`/reviews/${productId}`, data),
};

// ─── Users ─────────────────────────────
export const usersApi = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data: any) => api.patch('/users/profile', data),
  getLoyaltyPoints: () => api.get('/users/loyalty-points'),
};

// ─── Admin ─────────────────────────────
export const adminApi = {
  // Products
  getProducts: (params?: Record<string, any>) => api.get('/admin/products', { params }),
  createProduct: (data: any) => api.post('/admin/products', data),
  updateProduct: (id: string, data: any) => api.patch(`/admin/products/${id}`, data),
  deleteProduct: (id: string) => api.delete(`/admin/products/${id}`),
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/admin/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  // Sales
  applySale: (id: string, salePercent: number) =>
    api.post(`/admin/sales/apply/${id}`, { salePercent }),
  removeSale: (id: string) => api.delete(`/admin/sales/remove/${id}`),
  // Orders
  getOrders: () => api.get('/admin/orders'),
  updateOrderStatus: (id: string, status: string) =>
    api.patch(`/admin/orders/${id}/status`, { status }),
  // Stats
  getStats: () => api.get('/admin/stats'),
  getSalesGraph: () => api.get('/admin/stats/graph'),
  getBestSellers: (limit: number = 5) =>
    api.get(`/admin/stats/best-sellers?limit=${limit}`),
  // Users
  getUsers: () => api.get('/admin/users'),
  getUser: (id: string) => api.get(`/admin/users/${id}`),
  updateUserRole: (id: string, role: string) =>
    api.patch(`/admin/users/${id}/role`, { role }),
  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),
};

export default api;
