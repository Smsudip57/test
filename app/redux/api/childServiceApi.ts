import { baseApi } from "@/app/redux/baseApi";

// Child Services API endpoints
export const childServiceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET endpoint - Fetch all child services
    listChildServices: builder.query({
      query: () => ({
        url: `/api/v1/childservice/get`,
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data || response,
      providesTags: ["ChildServices"],
    }),

    // GET endpoint - Fetch child service by ID or SLUG with all related data
    // (ParentService, Blogs, FAQs, Knowledge Base, Bookings, Availability)
    getChildServiceByIdOrSlug: builder.query({
      query: (idOrSlug) => ({
        url: `/api/v1/childservice/get/${idOrSlug}`,
        method: "GET",
      }),
      transformResponse: (response: any) => response?.childService || response,
      providesTags: ["ChildServices"],
    }),

    // GET endpoint - Fetch all child services by parent service ID
    getChildServicesByParent: builder.query({
      query: (parentId) => ({
        url: `/api/v1/childservice/parent/${parentId}`,
        method: "GET",
      }),
      transformResponse: (response: any) => response?.childServices || response,
      providesTags: ["ChildServices"],
    }),
  }),
});

export const {
  useListChildServicesQuery,
  useGetChildServiceByIdOrSlugQuery,
  useGetChildServicesByParentQuery,
} = childServiceApi;
