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
          method: "GET",
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
  }),
  overrideExisting: false,
});

export const { useGetProductQuery } = productsApi;
