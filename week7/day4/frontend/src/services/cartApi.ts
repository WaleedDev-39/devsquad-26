import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
  color?: string;
}

export interface Cart {
  sessionId: string;
  items: CartItem[];
  updatedAt: string;
}

const getSessionId = (): string => {
  if (typeof window === 'undefined') return 'ssr-session';
  let sessionId = localStorage.getItem('yoursneaker_session');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('yoursneaker_session', sessionId);
  }
  return sessionId;
};

export const cartApi = createApi({
  reducerPath: 'cartApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  }),
  tagTypes: ['Cart'],
  endpoints: (builder) => ({
    getCart: builder.query<Cart, void>({
      query: () => `/cart/${getSessionId()}`,
      providesTags: ['Cart'],
    }),
    addToCart: builder.mutation<Cart, Omit<CartItem, 'quantity'> & { quantity?: number }>({
      query: (item) => ({
        url: `/cart/${getSessionId()}/items`,
        method: 'POST',
        body: { ...item, quantity: item.quantity || 1 },
      }),
      invalidatesTags: ['Cart'],
    }),
    updateCartItem: builder.mutation<Cart, { productId: string; quantity: number; size?: string; color?: string }>({
      query: ({ productId, ...body }) => ({
        url: `/cart/${getSessionId()}/items/${productId}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Cart'],
    }),
    removeFromCart: builder.mutation<Cart, { productId: string; size?: string; color?: string }>({
      query: ({ productId, size, color }) => {
        const params = new URLSearchParams();
        if (size) params.append('size', size);
        if (color) params.append('color', color);
        return {
          url: `/cart/${getSessionId()}/items/${productId}?${params.toString()}`,
          method: 'DELETE',
        };
      },
      invalidatesTags: ['Cart'],
    }),
    clearCart: builder.mutation<Cart, void>({
      query: () => ({
        url: `/cart/${getSessionId()}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
} = cartApi;
