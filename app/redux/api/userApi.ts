import { baseApi } from "@/app/redux/baseApi";

// Example: User API endpoints
export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET endpoint - Fetch user by ID
    getUser: builder.query({
      query: (userId) => ({
        url: `/api/users/${userId}`,
        method: "GET",
      }),
      providesTags: ["Users"],
    }),

    // GET endpoint - List all users
    listUsers: builder.query({
      query: (params) => ({
        url: `/api/users`,
        method: "GET",
        params, // query parameters like ?page=1&limit=10
      }),
      providesTags: ["Users"],
    }),

    // POST endpoint - Create user
    createUser: builder.mutation({
      query: (userData) => ({
        url: `/api/users`,
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["Users"],
    }),

    // PUT endpoint - Update user
    updateUser: builder.mutation({
      query: ({ userId, ...userData }) => ({
        url: `/api/users/${userId}`,
        method: "PUT",
        body: userData,
      }),
      invalidatesTags: ["Users"],
    }),

    // DELETE endpoint - Delete user
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/api/users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useGetUserQuery,
  useListUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;
