import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "@/lib/store";

export enum EmploymentType {
  FULL_TIME = "FULL_TIME",
  PART_TIME = "PART_TIME",
  CONTRACT = "CONTRACT",
  FREELANCE = "FREELANCE",
}

export enum ScoringStatus {
  PENDING = "PENDING",
  SCORING = "SCORING",
  COMPLETE = "COMPLETE",
}

export interface Job {
  id: string;
  companyId: string;
  title: string;
  description: string;
  location: string;
  employmentType: EmploymentType;
  experience: number;
  active: boolean;
  scoringStatus: ScoringStatus;
  isRemote: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  company?: {
    id: string;
    name: string;
    industry: string;
    location: string;
    domain: string;
  };
}

export interface GetJobsParams {
  page?: number;
  limit?: number;
  search?: string;
  location?: string;
  employmentType?: EmploymentType;
  active?: boolean;
  isRemote?: boolean;
}

export interface CreateJobRequest {
  title: string;
  description: string;
  location: string;
  employmentType?: EmploymentType;
  experience: number;
  tags?: string[];
  active?: boolean;
  isRemote?: boolean;
}

export interface UpdateJobRequest {
  id: string;
  title?: string;
  description?: string;
  location?: string;
  employmentType?: EmploymentType;
  experience?: number;
  tags?: string[];
  active?: boolean;
  isRemote?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  metadata: {
    total: number;
    page: number;
    limit: number;
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

export const jobApi = createApi({
  reducerPath: "jobApi",
  baseQuery,
  tagTypes: ["Job"],
  endpoints: (builder) => ({
    getJobs: builder.query<PaginatedResponse<Job>, GetJobsParams>({
      query: (params) => ({
        url: "/jobs",
        method: "GET",
        params,
      }),
      providesTags: ["Job"],
    }),
    getCompanyJobs: builder.query<PaginatedResponse<Job>, GetJobsParams>({
      query: (params) => ({
        url: "/jobs/company",
        method: "GET",
        params,
      }),
      providesTags: ["Job"],
    }),
    getJobById: builder.query<Job, string>({
      query: (id) => `/jobs/${id}`,
      providesTags: ["Job"],
    }),
    createJob: builder.mutation<Job, CreateJobRequest>({
      query: (data) => ({
        url: "/jobs",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Job"],
    }),
    updateJob: builder.mutation<Job, UpdateJobRequest>({
      query: (data) => {
        const { id, ...updateData } = data;
        return {
          url: `/jobs/${id}`,
          method: "PATCH",
          body: updateData,
        };
      },
      invalidatesTags: ["Job"],
    }),
    deleteJob: builder.mutation<void, string>({
      query: (id) => ({
        url: `/jobs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Job"],
    }),

    aiSearchJobs: builder.mutation<any, { query: string }>({
      query: (data) => ({
        url: "/jobs/ai-search",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetJobsQuery,
  useGetCompanyJobsQuery,
  useGetJobByIdQuery,
  useCreateJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
  useAiSearchJobsMutation,
} = jobApi;
