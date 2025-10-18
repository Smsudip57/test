import { baseApi } from "./baseApi";

export const productsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Get product by slug (single) or all products
        getProduct: builder.query<any, { slug?: string }>({
            query: (params) => {
                if (params?.slug) {
                    return {
                        url: `/api/product/get?slug=${params.slug}`,
                        method: "GET",
                    };
                }
                // If no slug, fetch all products
                return {
                    url: "/api/product/get",
                    method: "GET"
                };
            },
            transformResponse: (response: any) => {
                // If slug is provided, expect { success, product } else { success, products }
                if (response?.product) return response.product;
                if (response?.products) return response.products;
                return response;
            },
            providesTags: ["products"],
        }),
        // Create product (with images and sections)
        createProduct: builder.mutation<any, any>({
            query: (data) => ({
                url: "/api/product/create",
                method: "POST",
                body: data,
                headers: { "Content-Type": "application/json" },
            }),
            invalidatesTags: ["products"],
        }),
        // Edit product (with images and sections)
        editProduct: builder.mutation<any, any>({
            query: (data) => ({
                url: "/api/product/edit",
                method: "PUT",
                body: data,
                headers: { "Content-Type": "application/json" },
            }),
            invalidatesTags: ["products"],
        }),
        // Delete product (by productId)
        deleteProduct: builder.mutation<any, { productId: string }>({
            query: ({ productId }) => ({
                url: "/api/product/delete",
                method: "POST",
                body: { productId },
                headers: { "Content-Type": "application/json" },
            }),
            invalidatesTags: ["products"],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetProductQuery,
    useCreateProductMutation,
    useEditProductMutation,
    useDeleteProductMutation,
} = productsApi;
