import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApplicationStatus } from "../types";
import { RootState } from "@/lib/store";

export interface Application {
  id: string;
  candidateId: string;
  jobId: string;
  status: ApplicationStatus;
  score?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  job?: {
    id: string;
    title: string;
    location: string;
    employmentType: string;
    company: {
      id: string;
      name: string;
    };
  };
  candidate?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    candidateProfile?: {
      id: string;
      experience?: string;
      skills?: string[];
    };
  };
}

export interface CreateApplicationRequest {
  jobId: string;
}

export interface UpdateApplicationRequest {
  status?: ApplicationStatus;
  score?: number;
  notes?: string;
}

export interface GetApplicationsParams {
  status?: ApplicationStatus;
  page?: number;
  limit?: number;
}

export interface PaginatedApplicationsResponse {
  data: Application[];
  metadata: {
    total: number;
    limit: number;
    page: number;
    start: number;
    end: number;
    next: number | null;
    prev: number | null;
  };
}
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const applicationApi = createApi({
  reducerPath: "applicationApi",
  baseQuery: baseQuery,
  tagTypes: ["Application"],
  endpoints: (builder) => ({
    getApplications: builder.query<
      PaginatedApplicationsResponse,
      GetApplicationsParams
    >({
      query: (params) => ({
        url: "applications",
        params,
      }),
      providesTags: ["Application"],
    }),
    getMyApplications: builder.query<
      PaginatedApplicationsResponse,
      GetApplicationsParams
    >({
      query: (params) => ({
        url: "applications/my-applications",
        params,
      }),
      providesTags: ["Application"],
    }),
    getJobApplications: builder.query<
      PaginatedApplicationsResponse,
      { jobId: string } & GetApplicationsParams
    >({
      query: ({ jobId, ...params }) => ({
        url: `applications/job/${jobId}`,
        params,
      }),
      providesTags: ["Application"],
    }),
    getApplicationById: builder.query<Application, string>({
      query: (id) => `applications/${id}`,
      providesTags: ["Application"],
    }),
    createApplication: builder.mutation<Application, CreateApplicationRequest>({
      query: (data) => ({
        url: "applications",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Application"],
    }),
    updateApplication: builder.mutation<
      Application,
      { id: string; data: UpdateApplicationRequest }
    >({
      query: ({ id, data }) => ({
        url: `applications/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Application"],
    }),
    deleteApplication: builder.mutation<void, string>({
      query: (id) => ({
        url: `applications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Application"],
    }),
  }),
});

export const {
  useGetApplicationsQuery,
  useGetMyApplicationsQuery,
  useGetJobApplicationsQuery,
  useGetApplicationByIdQuery,
  useCreateApplicationMutation,
  useUpdateApplicationMutation,
  useDeleteApplicationMutation,
} = applicationApi;
