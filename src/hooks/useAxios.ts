import { ApiResponse } from '@/types/common';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';

type FetchOptions<T> = {
    endpoint: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    data?: unknown;
    params?: Record<string, string | number | boolean>;
    customHeaders?: Record<string, string>;
    onSuccess?: (response: ApiResponse<T>) => void;
    onError?: (error: Error) => void;
    withCredentials?: boolean;
};

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api-test.kodj.dev/api/v1';

export default function useAxios() {
    const router = useRouter();

    /* now useMemo is used to create the axios instance only once.
     * The instance and its interceptors will not be recreated on every render.
     */
    const axiosInstance = useMemo(() => {
        const instance = axios.create({
            baseURL: apiUrl,
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        instance.interceptors.request.use(
            (config) => {
                const accessToken = localStorage.getItem('access_token');
                if (accessToken && config.headers && !config.headers.Authorization) {
                    config.headers.Authorization = `Bearer ${accessToken}`;
                }
                return config;
            },
            (error) => Promise.reject(error),
        );

        instance.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;

                    try {
                        const refreshToken = localStorage.getItem('refresh_token');
                        if (!refreshToken) {
                            throw new Error('No refresh token available.');
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

                        if (response.data?.access_token && response.data?.refresh_token) {
                            const { access_token, refresh_token } = response.data;
                            localStorage.setItem('access_token', access_token);
                            localStorage.setItem('refresh_token', refresh_token);

                            originalRequest.headers.Authorization = `Bearer ${access_token}`;

                            return instance(originalRequest);
                        }
                    } catch (refreshError) {
                        localStorage.removeItem('access_token');
                        localStorage.removeItem('refresh_token');
                        router.push('/login');
                        console.error('Token refresh failed:', refreshError);
                        return Promise.reject(refreshError);
                    }
                }

                return Promise.reject(error);
            },
        );

        return instance;
    }, [router]);

    /*  This useCallback now depends only on the memoized axiosInstance,
     *  so it will not be recreated on every render,
     *  this is important for performance and to avoid unnecessary re-renders
     *  of components that use this hook.
     */
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
                    config.data = data;
                }

                if (data instanceof FormData) {
                    if (config.headers) {
                        delete config.headers['Content-Type'];
                    }
                    config.headers = {
                        ...config.headers,
                        'Content-Type': undefined,
                    };
                }

                const response: AxiosResponse = await axiosInstance(config);

                const apiResponse: ApiResponse<T> = {
                    data: response.data.data as T,
                    statusCode: response.status,
                    message: response.data.message || 'success',
                };

                if (onSuccess) {
                    onSuccess(apiResponse);
                }

                return apiResponse;
            } catch (error: unknown) {
                console.error(`useAxios unexpected error (${method} ${url}):`, error);

                if (error instanceof AxiosError && error.response) {
                    const apiResponse = {
                        data: error.response.data as T,
                        statusCode: error.response.status,
                        message: error.response.data?.message || 'Request failed',
                        error: true,
                    };
                    if (onError) {
                        onError(new Error(apiResponse.message));
                    }
                    return apiResponse;
                }

                const message = error instanceof Error ? error.message : 'An unknown error occurred';
                if (onError) {
                    onError(new Error(message));
                }

                return {
                    data: null as T,
                    statusCode: 500,
                    message: `Request to ${endpoint} failed: ${message}`,
                    error: true,
                };
            }
        },
        [axiosInstance],
    );
}
