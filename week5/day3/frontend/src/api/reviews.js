import axios from "axios";

const NEST_API_BASE_URL = import.meta.env.VITE_NEST_API_URL || "https://week5-day3-backend.onrender.com/reviews";

const api = axios.create({
  baseURL: NEST_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export const reviewsAPI = {
  getReviews: (productId) => api.get(`/product/${productId}`),
  addReview: (data) => api.post("/", data),
  addReply: (reviewId, data) => api.post(`/${reviewId}/replies`, data),
  toggleLike: (reviewId, data) => api.patch(`/${reviewId}/like`, data),
};
