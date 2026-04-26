import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const rawMaterialsApi = createApi({
  reducerPath: 'rawMaterialsApi',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_URL }),
  tagTypes: ['RawMaterial'],
  endpoints: (builder) => ({
    getRawMaterials: builder.query({
      query: () => '/raw-materials',
      providesTags: ['RawMaterial'],
    }),
    getLowStockMaterials: builder.query({
      query: () => '/raw-materials/low-stock',
      providesTags: ['RawMaterial'],
    }),
    createRawMaterial: builder.mutation({
      query: (body) => ({ url: '/raw-materials', method: 'POST', body }),
      invalidatesTags: ['RawMaterial'],
    }),
    updateRawMaterial: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/raw-materials/${id}`, method: 'PUT', body }),
      invalidatesTags: ['RawMaterial'],
    }),
    restockRawMaterial: builder.mutation({
      query: ({ id, quantity }) => ({
        url: `/raw-materials/${id}/restock`,
        method: 'PATCH',
        body: { quantity },
      }),
      invalidatesTags: ['RawMaterial'],
    }),
    deleteRawMaterial: builder.mutation({
      query: (id) => ({ url: `/raw-materials/${id}`, method: 'DELETE' }),
      invalidatesTags: ['RawMaterial'],
    }),
  }),
});

export const {
  useGetRawMaterialsQuery,
  useGetLowStockMaterialsQuery,
  useCreateRawMaterialMutation,
  useUpdateRawMaterialMutation,
  useRestockRawMaterialMutation,
  useDeleteRawMaterialMutation,
} = rawMaterialsApi;
