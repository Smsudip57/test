import { baseApi } from "../baseApi";

export const servicedetailsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get service details (by related service or id)
    getServiceDetails: builder.query<any, { relatedServices?: string; id?: string }>({
      query: (params) => {
        // Prefer id if provided, else relatedServices
        if (params?.id) {
          return {
            url: `/api/servicedetails/get/${params.id}`,
            method: "GET",
          };
        } else if (params?.relatedServices) {
          return {
            url: `/api/servicedetails/get?relatedServices=${params.relatedServices}`,
            method: "GET",
          };
        }
        return { url: "/api/servicedetails/get", method: "GET" };
      },
    }),
    // Create service details (with images)
    createServiceDetails: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/api/servicedetails/create",
        method: "POST",
        body: formData,
      }),
    }),
    // Update service details (with images)
    updateServiceDetails: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/api/servicedetails/edit",
        method: "POST",
        body: formData,
      }),
    }),
    // Delete service details (by id)
    deleteServiceDetails: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: "/api/servicedetails/delete",
        method: "POST",
        body: { id },
        headers: { "Content-Type": "application/json" },
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetServiceDetailsQuery,
  useCreateServiceDetailsMutation,
  useUpdateServiceDetailsMutation,
  useDeleteServiceDetailsMutation,
} = servicedetailsApi;
