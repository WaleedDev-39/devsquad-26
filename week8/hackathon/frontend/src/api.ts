import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_URL || '/api/' }),
  endpoints: (builder) => ({
    uploadDocument: builder.mutation<{ message: string; documentId: string }, FormData>({
      query: (formData) => ({
        url: 'documents/upload',
        method: 'POST',
        body: formData,
      }),
    }),
    getDocument: builder.query<any, string>({
      query: (id) => `documents/${id}`,
    }),
    getDocuments: builder.query<any[], void>({
      query: () => 'documents',
    }),
    sendMessage: builder.mutation<{ response: string }, { documentId: string; message: string }>({
      query: ({ documentId, message }) => ({
        url: `chat/${documentId}`,
        method: 'POST',
        body: { message },
      }),
    }),
  }),
});

export const {
  useUploadDocumentMutation,
  useGetDocumentQuery,
  useGetDocumentsQuery,
  useSendMessageMutation,
} = api;
