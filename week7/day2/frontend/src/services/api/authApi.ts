import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('circlechain_token');
        if (token) headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getCurrentUser: builder.query<any, void>({
      query: () => '/users/me',
    }),
    updateProfile: builder.mutation<any, { displayName: string }>({
      query: (body) => ({
        url: '/users/me',
        method: 'PUT',
        body,
      }),
    }),
  }),
});

export const { useGetCurrentUserQuery, useUpdateProfileMutation } = authApi;
