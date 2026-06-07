import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const matchApi = createApi({
  reducerPath: "matchApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://week4-day4-score-app-backend.onrender.com" }),
  endpoints: (builder) => ({
    getMatches: builder.query({
      query: () => "/api/matches",
    }),
    getMatchById: builder.query({
      query: (id) => `/api/matches/${id}`,
    }),
  }),
});

export const { useGetMatchesQuery, useGetMatchByIdQuery } = matchApi;
