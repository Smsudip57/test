import { baseApi } from "./baseApi";

export const childServiceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all child services
    getChildServices: builder.query<any, void>({
      query: () => ({
        url: "/api/child/get",
        method: "GET",
      }),
      transformResponse: (response: any) => {
        if (response?.products) return response.products;
        if (Array.isArray(response)) return response;
        return response;
      },
      providesTags: ["child-service"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetChildServicesQuery, useLazyGetChildServicesQuery } =
  childServiceApi;
