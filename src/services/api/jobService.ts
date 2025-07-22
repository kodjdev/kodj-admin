import { ApiResponse, PaginationParams } from '@/types/common';
import { JobFormData, JobApiResponse, JobsApiResponse } from '@/types/job';
import { useMemo } from 'react';
import useAxios from '@/hooks/useAxios';

export const useJobService = () => {
    const fetchData = useAxios();

    return useMemo(
        () => ({
            getJobPosts: async (params?: PaginationParams): Promise<ApiResponse<JobsApiResponse>> => {
                return fetchData({
                    endpoint: '/public/job-posts',
                    method: 'GET',
                    params,
                });
            },

            getJobPostById: async (id: number): Promise<JobApiResponse> => {
                return fetchData({
                    endpoint: `/public/job-posts/${id}`,
                    method: 'GET',
                });
            },

            createJobPost: async (jobData: JobFormData): Promise<JobApiResponse> => {
                const formData = new FormData();

                Object.entries(jobData).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        if (key === 'image' && value instanceof File) {
                            formData.append(key, value);
                        } else {
                            formData.append(key, String(value));
                        }
                    }
                });

                return fetchData({
                    endpoint: '/admin/job-posts',
                    method: 'POST',
                    data: formData,
                    // customHeaders: {
                    //     'Content-Type': 'multipart/form-data',
                    // },
                });
            },

            updateJobPost: async (id: number, jobData: JobFormData): Promise<JobApiResponse> => {
                const formData = new FormData();

                Object.entries(jobData).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        if (key === 'image' && value instanceof File) {
                            formData.append(key, value);
                        } else {
                            formData.append(key, String(value));
                        }
                    }
                });

                return fetchData({
                    endpoint: `/admin/job-posts/${id}`,
                    method: 'PUT',
                    data: formData,
                    // customHeaders: {
                    //     'Content-Type': 'multipart/form-data',
                    // },
                });
            },

            deleteJobPost: async (id: number): Promise<ApiResponse<string>> => {
                return fetchData<string>({
                    endpoint: `/admin/job-posts/${id}`,
                    method: 'DELETE',
                });
            },
        }),
        [fetchData],
    );
};
