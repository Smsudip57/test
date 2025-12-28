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

        // Create a new child service
        createChildService: builder.mutation<any, any>({
            query: (data) => ({
                url: "/api/child/create",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["child-service"],
        }),

        // Edit an existing child service
        editChildService: builder.mutation<any, any>({
            query: (data) => ({
                url: "/api/child/edit",
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["child-service"],
        }),

        // Delete a child service
        deleteChildService: builder.mutation<any, { childId: string }>({
            query: ({ childId }) => ({
                url: "/api/child/delete",
                method: "POST",
                body: { childId },
            }),
            invalidatesTags: ["child-service"],
        }),

    }),
    overrideExisting: false,
});

export const {
    useGetChildServicesQuery,
    useLazyGetChildServicesQuery,
    useCreateChildServiceMutation,
    useEditChildServiceMutation,
    useDeleteChildServiceMutation
} = childServiceApi;