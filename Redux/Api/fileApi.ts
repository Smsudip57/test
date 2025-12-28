import { baseApi } from './baseApi';

export const fileApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        uploadFile: builder.mutation<{ url: string }, FormData>({
            query: (formData) => ({
                url: '/api/files/upload',
                method: 'POST',
                body: formData,
            }),
        }),
    }),
    overrideExisting: false,
});

export const { useUploadFileMutation } = fileApi;