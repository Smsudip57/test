import { baseApi } from "@/redux/baseApi";

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
    oldGetServices: builder.query<any[], void>({
      query: () => ({
        url: `/api/service/getservice`,
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data || response,
    }),

    oldCreateService: builder.mutation<any, {
      Title: string;
      Name: string;
      slug: string;
      detail: string;
      moreDetail: string;
      category: string;
      image: string;
    }>({
      query: (body) => ({
        url: `/api/service/createservice`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["service", "service-detail"],
    }),

    oldEditService: builder.mutation<any, {
      serviceId: string;
      Title: string;
      Name: string;
      slug: string;
      deltail: string;
      moreDetail: string;
      category: string;
      image: string;
    }>({
      query: (body) => ({
        url: `/api/service/editservice`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["service", "service-detail"],
    }),

    oldDeleteService: builder.mutation<any, { serviceId: string }>({
      query: (body) => ({
        url: `/api/service/deleteservice`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["service", "service-detail"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllServicesQuery,
  useLazyGetAllServicesQuery,
  useGetSingleServiceQuery,
  useLazyGetSingleServiceQuery,
  useOldGetServicesQuery,
  useOldCreateServiceMutation,
  useOldEditServiceMutation,
  useOldDeleteServiceMutation,
} = serviceApi;
