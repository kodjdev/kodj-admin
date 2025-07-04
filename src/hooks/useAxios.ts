import { ApiResponse } from '@/types/common';
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';

type FetchOptions<T> = {
    endpoint: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    data?: any;
    params?: Record<string, any>;
    customHeaders?: Record<string, string>;
    onSuccess?: (response: ApiResponse<T>) => void;
    onError?: (error: Error | AxiosError) => void;
    withCredentials?: boolean;
};

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api-test.kodj.dev/api/v1';

export default function useAxios() {
    const router = useRouter();
    const [error, setError] = useState<Error | null>(null);

    const axiosInstance = axios.create({
        baseURL: apiUrl,
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const setupInterceptors = (axiosInstance: AxiosInstance) => {
        axiosInstance.interceptors.request.use(
            (config) => {
                const accessToken = localStorage.getItem('access_token');
                if (accessToken && config.headers && !config.headers.Authorization) {
                    config.headers.Authorization = `Bearer ${accessToken}`;
                }
                return config;
            },
            (error) => Promise.reject(error),
        );

        axiosInstance.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;

                    try {
                        const refreshToken = localStorage.getItem('refresh_token');
                        if (!refreshToken) {
                            throw new Error('No refresh token');
                        }

                        const response = await axios.post(
                            `${apiUrl}/auth/token/refresh`,
                            {},
                            {
                                headers: {
                                    Authorization: `Bearer ${refreshToken}`,
                                    'Content-Type': 'application/json',
                                },
                            },
                        );

                        if (response.data?.data?.access_token) {
                            localStorage.setItem('access_token', response.data.data.access_token);
                            localStorage.setItem('refresh_token', response.data.data.refresh_token);

                            originalRequest.headers.Authorization = `Bearer ${response.data.data.access_token}`;
                            return axiosInstance(originalRequest);
                        }
                    } catch (refreshError) {
                        localStorage.removeItem('access_token');
                        localStorage.removeItem('refresh_token');
                        router.push('/login');
                    }
                }

                return Promise.reject(error);
            },
        );
    };

    setupInterceptors(axiosInstance);

    return useCallback(
        async <T = unknown>({
            endpoint,
            method = 'GET',
            data = null,
            params = {},
            customHeaders = {},
            onSuccess,
            onError,
            withCredentials = true,
        }: FetchOptions<T>): Promise<ApiResponse<T>> => {
            const url = endpoint;
            console.log(`useAxios: Making ${method} request to ${url}`);

            try {
                const config: AxiosRequestConfig = {
                    method,
                    url,
                    params,
                    headers: { ...customHeaders },
                    withCredentials,
                };

                if (data) {
                    if (data instanceof FormData) {
                        /* we use the axios directly without instance defaults for formData */
                        try {
                            const response: AxiosResponse = await axios({
                                method,
                                url: `${apiUrl}${endpoint}`,
                                data,
                                params,
                                headers: {
                                    ...customHeaders,
                                },
                                withCredentials,
                            });

                            console.log(`useAxios: Received response with status ${response.status}`);

                            const apiResponse: ApiResponse<T> = {
                                data: response.data,
                                statusCode: response.status,
                                message: response.data.message || 'success',
                            };

                            if (onSuccess) {
                                onSuccess(apiResponse);
                            }

                            return apiResponse;
                        } catch (formDataError) {
                            if (formDataError instanceof AxiosError && formDataError.response) {
                                return {
                                    data: null,
                                    statusCode: formDataError.response.status,
                                    message: formDataError.response.data?.message || 'Request failed',
                                    error: true,
                                } as any;
                            }
                            throw formDataError;
                        }
                    } else if (typeof data === 'object' && Object.keys(data).includes('credential')) {
                        config.data = {
                            credential: data.credential,
                        };
                    } else {
                        config.data = data;
                    }
                }

                /* for non-formData requests, we use the configured instance with error handling */
                let response: AxiosResponse;

                try {
                    response = await axiosInstance(config);
                } catch (axiosError) {
                    if (axiosError instanceof AxiosError && axiosError.response) {
                        console.error('Axios error caught:', axiosError.response.status, axiosError.response.data);

                        return {
                            data: axiosError.response.data,
                            statusCode: axiosError.response.status,
                            message: axiosError.response.data?.message || axiosError.message || 'Request failed',
                            error: true,
                        } as any;
                    }

                    throw axiosError;
                }

                console.log(`useAxios: Received response with status ${response.status}`);

                const apiResponse: ApiResponse<T> = {
                    data: response.data,
                    statusCode: response.status,
                    message: response.data.message || 'success',
                };

                console.log('useAxios: Parsed response data:', apiResponse);

                if (onSuccess) {
                    onSuccess(apiResponse);
                }

                return apiResponse;
            } catch (error: unknown) {
                console.error(`useAxios unexpected error (${method} ${url}):`, error);

                if (onError) {
                    onError(error as Error | AxiosError);
                } else {
                    setError({
                        name: 'AxiosError',
                        stack: (error as Error).stack,
                        message: `Request to ${endpoint} failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
                    });
                }

                /* for a completely unexpected errors, we throw an error */
                throw error;
            }
        },
        [setError, axiosInstance, router],
    );
}
