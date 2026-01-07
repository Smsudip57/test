import { baseApi } from "@/app/redux/baseApi";

// Industries API endpoints
export const industryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET endpoint - Fetch all industries with their descriptive relationships
    listIndustries: builder.query({
      query: () => ({
        url: `/api/v1/industry/get`,
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data || response,
      providesTags: ["Industries"],
    }),

    // GET endpoint - Fetch industry by ID or SLUG with all related data
    // (Services, Products, Child Services, Testimonials, Projects, Blogs, Knowledge Base, FAQs)
    getIndustryByIdOrSlug: builder.query({
      query: (idOrSlug) => ({
        url: `/api/v1/industry/get/${idOrSlug}`,
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data || response,
      providesTags: ["Industries"],
    }),
  }),
});

export const { useListIndustriesQuery, useGetIndustryByIdOrSlugQuery } =
  industryApi;
