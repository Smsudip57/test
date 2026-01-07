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

    // CREATE endpoint - Create a new parent service (OLD API)
    oldCreateParentService: builder.mutation<any, any>({
      query: (data) => ({
        url: "/api/product/create",
        method: "POST",
        body: data,
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: ["ParentServices"],
    }),

    // EDIT endpoint - Edit an existing parent service (OLD API)
    oldEditParentService: builder.mutation<any, any>({
      query: (data) => ({
        url: "/api/product/edit",
        method: "PUT",
        body: data,
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: ["ParentServices"],
    }),

    // DELETE endpoint - Delete a parent service (OLD API)
    oldDeleteParentService: builder.mutation<any, { productId: string }>({
      query: ({ productId }) => ({
        url: "/api/product/delete",
        method: "POST",
        body: { productId },
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: ["ParentServices"],
    }),
  }),
});

export const {
  useListParentServicesQuery,
  useGetParentServiceByIdOrSlugQuery,
  useOldCreateParentServiceMutation,
  useOldEditParentServiceMutation,
  useOldDeleteParentServiceMutation,
} = parentServiceApi;
