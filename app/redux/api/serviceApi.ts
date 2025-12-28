import { baseApi } from "@/app/redux/baseApi";

// Example: Product/Service API endpoints
export const serviceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET endpoint - Fetch service by ID
    getService: builder.query({
      query: (serviceId) => ({
        url: `/api/services/${serviceId}`,
        method: "GET",
      }),
      providesTags: ["Services"],
    }),

    // GET endpoint - List all services
    listServices: builder.query({
      query: (params) => ({
        url: `/api/services`,
        method: "GET",
        params,
      }),
      providesTags: ["Services"],
    }),

    // POST endpoint - Create service
    createService: builder.mutation({
      query: (serviceData) => ({
        url: `/api/services`,
        method: "POST",
        body: serviceData,
      }),
      invalidatesTags: ["Services"],
    }),

    // PUT endpoint - Update service
    updateService: builder.mutation({
      query: ({ serviceId, ...serviceData }) => ({
        url: `/api/services/${serviceId}`,
        method: "PUT",
        body: serviceData,
      }),
      invalidatesTags: ["Services"],
    }),

    // DELETE endpoint - Delete service
    deleteService: builder.mutation({
      query: (serviceId) => ({
        url: `/api/services/${serviceId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Services"],
    }),
  }),
});

export const {
  useGetServiceQuery,
  useListServicesQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} = serviceApi;
