import { baseApi } from "../baseApi";

export const parentServiceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getParentServices: builder.query<any, void>({
      query: () => ({
        url: "/api/service/getservice",
        method: "GET",
      }),
    }),
    createParentService: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/api/service/createservice",
        method: "POST",
        body: formData,
      }),
    }),
    updateParentService: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/api/service/editservice",
        method: "POST",
        body: formData,
      }),
    }),
    deleteParentService: builder.mutation<any, { serviceId: string }>({
      query: ({ serviceId }) => ({
        url: "/api/service/deleteservice",
        method: "POST",
        body: { serviceId },
        headers: { 'Content-Type': 'application/json' },
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetParentServicesQuery,
  useCreateParentServiceMutation,
  useUpdateParentServiceMutation,
  useDeleteParentServiceMutation,
} = parentServiceApi;
