import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '@/lib/store';

export interface Company {
  id: string;
  name: string;
  industry: string;
  location: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCompanyRequest {
  name: string;
  industry: string;
  location: string;
}

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const companyApi = createApi({
  reducerPath: 'companyApi',
  baseQuery,
  tagTypes: ['Company'],
  endpoints: (builder) => ({
    createCompany: builder.mutation<Company, CreateCompanyRequest>({
      query: (data) => ({
        url: '/company',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Company'],
    }),
    getCompany: builder.query<Company, void>({
      query: () => '/company',
      providesTags: ['Company'],
    }),
  }),
});

export const { useCreateCompanyMutation, useGetCompanyQuery } = companyApi;