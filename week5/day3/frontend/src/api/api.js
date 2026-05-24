import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://week3-hackathon-backend-rho.vercel.app/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    return Promise.reject(err);
  }
);

// Auth
export const authAPI = {
  signup: (data) => api.post("/auth/signup", data),
  login: (data) => api.post("/auth/login", data),
  getProfile: () => api.get("/auth/profile"),
  validateToken: () => api.get("/auth/validate"),
};

// Products
export const productAPI = {
  getProducts: (params) => api.get("/products", { params }),
  getProduct: (id) => api.get(`/products/${id}`),
  getRelated: (id) => api.get(`/products/${id}/related`),
  getCategories: () => api.get("/products/categories"),
  getFilters: () => api.get("/products/filters"),
  createProduct: (data) => api.post("/products", data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),
};

// Cart
export const cartAPI = {
  getCart: () => api.get("/cart"),
  addToCart: (data) => api.post("/cart/add", data),
  updateItem: (itemId, data) => api.put(`/cart/item/${itemId}`, data),
  removeItem: (itemId) => api.delete(`/cart/item/${itemId}`),
  clearCart: () => api.delete("/cart/clear"),
};

// Orders
export const orderAPI = {
  placeOrder: (data) => api.post("/orders", data),
  getMyOrders: () => api.get("/orders/my-orders"),
  getOrder: (id) => api.get(`/orders/${id}`),
  getAllOrders: (params) => api.get("/orders/all", { params }),
  updateStatus: (id, data) => api.put(`/orders/${id}/status`, data),
};

// Admin
export const adminAPI = {
  getAnalytics: () => api.get("/admin/analytics"),
  getUsers: (params) => api.get("/admin/users", { params }),
  blockUser: (id) => api.put(`/admin/users/${id}/block`),
  unblockUser: (id) => api.put(`/admin/users/${id}/unblock`),
  updateRole: (id, data) => api.put(`/admin/users/${id}/role`, data),
};

export default api;
