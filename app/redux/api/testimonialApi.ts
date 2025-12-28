import { baseApi } from "@/app/redux/baseApi";

// Testimonials/Customer Success Stories API endpoints
export const testimonialApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET endpoint - Fetch all testimonials with populated data
    listTestimonials: builder.query({
      query: () => ({
        url: `/api/testimonial/get`,
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data || response,
      providesTags: ["Testimonials"],
    }),
    // GET endpoint - Fetch testimonial by ID
    getTestimonialById: builder.query({
      query: (testimonialId) => ({
        url: `/api/testimonial/get/${testimonialId}`,
        method: "GET",
      }),
      transformResponse: (response: any) => response?.testimonial || response,
      providesTags: ["Testimonials"],
    }),

    // POST endpoint - Create testimonial
    createTestimonial: builder.mutation({
      query: (formData) => ({
        url: `/api/testimonial/create`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Testimonials"],
    }),

    // POST endpoint - Update testimonial
    updateTestimonial: builder.mutation({
      query: (formData) => ({
        url: `/api/testimonial/edit`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Testimonials"],
    }),

    // POST endpoint - Delete testimonial
    deleteTestimonial: builder.mutation({
      query: (testimonialId) => ({
        url: `/api/testimonial/delete`,
        method: "POST",
        body: { testimonialId },
      }),
      invalidatesTags: ["Testimonials"],
    }),
  }),
});

export const {
  useListTestimonialsQuery,
  useGetTestimonialByIdQuery,
  useCreateTestimonialMutation,
  useUpdateTestimonialMutation,
  useDeleteTestimonialMutation,
} = testimonialApi;
