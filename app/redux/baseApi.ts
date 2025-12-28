import {
  BaseQueryApi,
  BaseQueryFn,
  DefinitionType,
  FetchArgs,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
// import * as Sentry from "@sentry/nextjs";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  credentials: "include",
  prepareHeaders: (headers) => {
    return headers;
  },
});

const baseQueryWithRefreshToken: BaseQueryFn<
  FetchArgs,
  BaseQueryApi,
  DefinitionType
> = async (args, api, extraOptions): Promise<any> => {
  try {
    let result = await baseQuery(args, api, extraOptions);

    // if (result?.error?.status === 401) {
    //   console.log("Sending refresh token");

    //   const refreshTokenResult = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/refresh-token`, {
    //     method: "POST",
    //     credentials: "include",
    //   });

    //   const data = await refreshTokenResult.json();

    //   if (data?.data?.access_token) {
    //     result = await baseQuery(args, api, extraOptions);
    //   }
    // }

    return result;
  } catch (error) {
    // Sentry.withScope((scope) => {
    //     scope.setExtra("endpoint", args.url);
    //     scope.setExtra("method", args.method);
    //     scope.setLevel("fatal");

    //     Sentry.captureException(error);
    // });
    throw error;
  }
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithRefreshToken,
  endpoints: () => ({}),
  tagTypes: ["Users", "Services", "Projects", "Blogs", "Testimonials", "ParentServices","ChildServices" ],
});
