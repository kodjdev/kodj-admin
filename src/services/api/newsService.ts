import { ApiResponse, PaginationParams } from '@/types/common';
import { News, NewsFormData } from '@/types/news';
import { useMemo } from 'react';
import useAxios from '@/hooks/useAxios';

export const useNewsService = () => {
    const fetchData = useAxios();

    return useMemo(
        () => ({
            getNews: async (params?: PaginationParams): Promise<ApiResponse<News[]>> => {
                return fetchData<News[]>({
                    endpoint: '/news',
                    method: 'GET',
                    params,
                });
            },

            getNewsById: async (id: number): Promise<ApiResponse<News>> => {
                return fetchData<News>({
                    endpoint: `/news/${id}`,
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

                return fetchData<News>({
                    endpoint: '/news',
                    method: 'POST',
                    data: formData,
                    customHeaders: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            },

            updateNews: async (id: number, newsData: Partial<NewsFormData>): Promise<ApiResponse<News>> => {
                return fetchData<News>({
                    endpoint: `/news/${id}`,
                    method: 'PUT',
                    data: newsData,
                });
            },

            deleteNews: async (id: number): Promise<ApiResponse<string>> => {
                return fetchData<string>({
                    endpoint: `/news/${id}`,
                    method: 'DELETE',
                });
            },
        }),
        [fetchData],
    );
};
