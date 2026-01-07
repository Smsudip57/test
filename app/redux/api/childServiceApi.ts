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

    // CREATE endpoint - Create a new child service (OLD API)
    oldCreateChildService: builder.mutation<any, any>({
      query: (data) => ({
        url: "/api/child/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["ChildServices"],
    }),

    // EDIT endpoint - Edit an existing child service (OLD API)
    oldEditChildService: builder.mutation<any, any>({
      query: (data) => ({
        url: "/api/child/edit",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["ChildServices"],
    }),

    // DELETE endpoint - Delete a child service (OLD API)
    oldDeleteChildService: builder.mutation<any, { childId: string }>({
      query: ({ childId }) => ({
        url: "/api/child/delete",
        method: "POST",
        body: { childId },
      }),
      invalidatesTags: ["ChildServices"],
    }),
  }),
});

export const {
  useListChildServicesQuery,
  useGetChildServiceByIdOrSlugQuery,
  useGetChildServicesByParentQuery,
  useOldCreateChildServiceMutation,
  useOldEditChildServiceMutation,
  useOldDeleteChildServiceMutation,
} = childServiceApi;
