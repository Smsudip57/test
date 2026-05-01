import { baseApi } from '../baseApi';

export const fileApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        uploadFile: builder.mutation({
            query: (formData) => ({
                url: '/api/files/upload',
                method: 'POST',
                body: formData,
            }),
        }),
        getPresignedUrl: builder.mutation({
            query: (body) => ({
                url: '/api/files/presigned-url',
                method: 'POST',
                body,
            }),
        }),
    }),
    overrideExisting: false,
});

export const { useUploadFileMutation, useGetPresignedUrlMutation } = fileApi;