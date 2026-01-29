import { baseApi } from "@/app/redux/baseApi";

// Service API endpoints with new V1 routes
export const serviceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all services with their details
    getAllServices: builder.query<any, void>({
      query: () => ({
        url: `/api/v1/service/get`,
        method: "GET",
      }),
      transformResponse: (response: any) => {
        if (response?.data) return response.data;
        if (Array.isArray(response)) return response;
        return response;
      },
      providesTags: ["service"],
    }),

    // Get single service by ID or SLUG with all related data
    getSingleService: builder.query<any, string>({
      query: (idOrSlug) => ({
        url: `/api/v1/service/get/${idOrSlug}`,
        method: "GET",
      }),
      transformResponse: (response: any) => {
        if (response?.data) return response.data;
        return response;
      },
      providesTags: ["service-detail"],
    }),

    // Legacy endpoint - keeping for backward compatibility
    oldGetServices: builder.query({
      query: () => ({
        url: `/api/service/getservice`,
        method: "GET",
      }),
    })
  }),
  overrideExisting: false,
});

export const {
  useGetAllServicesQuery,
  useLazyGetAllServicesQuery,
  useGetSingleServiceQuery,
  useLazyGetSingleServiceQuery,
  useOldGetServicesQuery,
} = serviceApi;
