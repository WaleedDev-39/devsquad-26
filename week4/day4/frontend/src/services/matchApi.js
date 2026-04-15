import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const matchApi = createApi({
  reducerPath: "matchApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://q7rysl-4000.csb.app" }),
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
