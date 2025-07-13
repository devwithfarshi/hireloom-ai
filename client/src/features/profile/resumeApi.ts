import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "@/lib/store";

export interface ResumeUploadResponse {
  message: string;
}

export interface ResumeResponse {
  url: string;
}

export const resumeApi = createApi({
  reducerPath: "resumeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Resume"],
  endpoints: (builder) => ({
    uploadResume: builder.mutation<ResumeUploadResponse, FormData>({
      query: (formData) => ({
        url: "/candidate-resume/upload",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Resume"],
    }),
    getResume: builder.query<ResumeResponse, void>({
      query: () => "/candidate-resume/by-candidate-id",
      providesTags: ["Resume"],
    }),
    getResumeByCandidateId: builder.query<ResumeResponse, string>({
      query: (candidateId) => `/candidate-resume/by-candidate-id/${candidateId}`,
      providesTags: ["Resume"],
    }),
  }),
});

export const {
  useUploadResumeMutation,
  useGetResumeQuery,
  useGetResumeByCandidateIdQuery,
} = resumeApi;