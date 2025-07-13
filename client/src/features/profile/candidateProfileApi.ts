import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "@/lib/store";

export interface SocialLink {
  platform: string;
  url: string;
}

export interface CandidateProfile {
  id: string;
  userId: string;
  location: string;
  openToRemote: boolean;
  skills: string[];
  experience: number;
  socialLinks?: SocialLink[];
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
  };
}

export interface CreateCandidateProfileRequest {
  location: string;
  openToRemote?: boolean;
  skills: string[];
  experience: number;
  socialLinks?: SocialLink[];
}

export interface UpdateCandidateProfileRequest {
  id: string;
  location?: string;
  openToRemote?: boolean;
  skills?: string[];
  experience?: number;
  socialLinks?: SocialLink[];
}

export const candidateProfileApi = createApi({
  reducerPath: "candidateProfileApi",
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
  endpoints: (builder) => ({
    getCandidateProfile: builder.query<CandidateProfile, void>({
      query: () => "/candidate-profile",
    }),
    createCandidateProfile: builder.mutation<
      CandidateProfile,
      CreateCandidateProfileRequest
    >({
      query: (data) => ({
        url: "/candidate-profile",
        method: "POST",
        body: data,
      }),
    }),
    updateCandidateProfile: builder.mutation<
      CandidateProfile,
      UpdateCandidateProfileRequest
    >({
      query: (data) => {
        const { id, ...updateData } = data;
        return {
          url: `/candidate-profile/${id}`,
          method: "PUT",
          body: updateData,
        };
      },
    }),
  }),
});

export const {
  useGetCandidateProfileQuery,
  useCreateCandidateProfileMutation,
  useUpdateCandidateProfileMutation,
} = candidateProfileApi;
