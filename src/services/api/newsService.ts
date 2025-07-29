import { ApiResponse, PaginationParams } from '@/types/common';
import { News, NewsFormData, PaginatedResponse } from '@/types/news';
import { useMemo } from 'react';
import useAxios from '@/hooks/useAxios';

export const useNewsService = () => {
    const fetchData = useAxios();

    return useMemo(
        () => ({
            getNews: async (params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<News>>> => {
                const response = await fetchData<PaginatedResponse<News>>({
                    endpoint: '/public/news',
                    method: 'GET',
                    params,
                });

                return response;
            },

            getNewsById: async (id: number): Promise<ApiResponse<News>> => {
                return fetchData<News>({
                    endpoint: `/public/news/${id}`,
                    method: 'GET',
                });
            },

            createNews: async (newsData: NewsFormData): Promise<ApiResponse<News>> => {
                const formData = new FormData();

                Object.entries(newsData).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        if (key === 'imageFile' && value instanceof File) {
                            formData.append(key, value);
                        } else {
                            formData.append(key, String(value));
                        }
                    }
                });

                const accessToken = localStorage.getItem('access_token');

                return fetchData<News>({
                    endpoint: '/admin/news',
                    method: 'POST',
                    data: formData,
                    customHeaders: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
            },

            updateNews: async (id: number, newsData: Partial<NewsFormData>): Promise<ApiResponse<News>> => {
                return fetchData<News>({
                    endpoint: `/admin/news/${id}`,
                    method: 'PUT',
                    data: newsData,
                });
            },

            deleteNews: async (id: number): Promise<ApiResponse<string>> => {
                return fetchData<string>({
                    endpoint: `/admin/news/${id}`,
                    method: 'DELETE',
                });
            },
        }),
        [fetchData],
    );
};
