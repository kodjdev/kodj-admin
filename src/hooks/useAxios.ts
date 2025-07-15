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

    // useMemo is used to create the axios instance only once.
    // The instance and its interceptors will not be recreated on every render.
    const axiosInstance = useMemo(() => {
        const instance = axios.create({
            baseURL: apiUrl,
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Request interceptor to add the auth token
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

        // Response interceptor to handle token refresh
        instance.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                // Handle 401 Unauthorized errors
                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true; // Mark request as retried to prevent infinite loops

                    try {
                        const refreshToken = localStorage.getItem('refresh_token');
                        if (!refreshToken) {
                            // If no refresh token, we can't do anything.
                            throw new Error('No refresh token available.');
                        }

                        // Request a new access token using the refresh token
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
                            const { access_token, refresh_token } = response.data.data;
                            // Store the new tokens
                            localStorage.setItem('access_token', access_token);
                            localStorage.setItem('refresh_token', refresh_token);

                            // Update the authorization header for the original request
                            originalRequest.headers.Authorization = `Bearer ${access_token}`;

                            // Retry the original request with the new token
                            return instance(originalRequest);
                        }
                    } catch (refreshError) {
                        // If refresh fails, clear auth data and redirect to login
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
    }, [router]); // The router instance from Next.js is stable

    // This useCallback now depends only on the memoized axiosInstance,
    // so it will not be recreated on every render.
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

                // Assign data only if it's not null
                if (data) {
                    config.data = data;
                }

                if (data instanceof FormData && config.headers) {
                    delete config.headers['Content-Type'];
                }

                // All requests now use the same instance, including FormData requests.
                const response: AxiosResponse = await axiosInstance(config);

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
            } catch (error: unknown) {
                console.error(`useAxios unexpected error (${method} ${url}):`, error);

                if (error instanceof AxiosError && error.response) {
                    // This is a structured error from an API response (e.g., 404, 500)
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

                // This is a network error or some other unexpected issue
                const message = error instanceof Error ? error.message : 'An unknown error occurred';
                if (onError) {
                    onError(new Error(message));
                }

                // Return a consistent error structure for unhandled errors
                return {
                    data: null as T,
                    statusCode: 500,
                    message: `Request to ${endpoint} failed: ${message}`,
                    error: true,
                };
            }
        },
        [axiosInstance], // Dependency is now stable
    );
}
