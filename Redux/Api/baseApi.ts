import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl:  process.env.NEXT_PUBLIC_BASE_URL,
    credentials: "include",
  }),
  tagTypes: ["child-service","products", "User"],
  endpoints: () => ({}),
});
