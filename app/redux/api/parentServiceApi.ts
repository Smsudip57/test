import { baseApi } from "@/app/redux/baseApi";

// Parent Services API endpoints
export const parentServiceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET endpoint - Fetch all parent services
    listParentServices: builder.query({
      query: () => ({
        url: `/api/v1/parentservice/get`,
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data || response,
      providesTags: ["ParentServices"],
    }),

    // GET endpoint - Fetch parent service by ID or SLUG with all related data
    // (Child Services, Blogs, FAQs, Knowledge Base, Bookings, Availability)
    getParentServiceByIdOrSlug: builder.query({
      query: (idOrSlug) => ({
        url: `/api/v1/parentservice/get/${idOrSlug}`,
        method: "GET",
      }),
      transformResponse: (response: any) => response?.parentService || response,
      providesTags: ["ParentServices"],
    }),
  }),
});

export const {
  useListParentServicesQuery,
  useGetParentServiceByIdOrSlugQuery,
} = parentServiceApi;
