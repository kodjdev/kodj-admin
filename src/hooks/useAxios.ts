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
        axiosInstance.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    router.push('/login');
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
                    if (typeof data === 'object' && Object.keys(data).includes('credential')) {
                        config.data = {
                            credential: data.credential,
                        };
                    } else {
                        config.data = data;
                    }
                }

                const response: AxiosResponse = await axiosInstance(config);
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
                console.error(`useAxios error (${method} ${url}):`, error);

                const errorMessage =
                    error instanceof Error
                        ? error.message
                        : (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
                          'An unexpected error occurred';

                if (onError) {
                    onError(error as Error | AxiosError);
                } else {
                    setError({
                        name: 'AxiosError',
                        stack: (error as Error).stack,
                        message: `Request to ${endpoint} failed: ${errorMessage}`,
                    });
                }

                throw error;
            }
        },
        [setError, axiosInstance],
    );
}

// import createAxiosInstance from '@/services/axiosInstance';
// import { ApiResponse } from '@/types/common';
// import { AxiosError } from 'axios';
// import { useCallback, useState } from 'react';

// type FetchOptions<T> = {
//     endpoint: string;
//     method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
//     data?: any;
//     params?: Record<string, any>;
//     customHeaders?: Record<string, string>;
//     onSuccess?: (response: ApiResponse<T>) => void;
//     onError?: (error: Error | AxiosError) => void;
//     withCredentials?: boolean;
// };

// export default function useFetch() {
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState<Error | null>(null);
//     const axiosInstance = createAxiosInstance();

//     const fetchData = useCallback(
//         async <T>(options: FetchOptions<T>): Promise<ApiResponse<T>> => {
//             const {
//                 endpoint,
//                 method = 'GET',
//                 data,
//                 params,
//                 customHeaders,
//                 onSuccess,
//                 onError,
//                 withCredentials = false,
//             } = options;

//             setLoading(true);
//             setError(null);

//             try {
//                 const response = await axiosInstance.request<ApiResponse<T>>({
//                     url: endpoint,
//                     method,
//                     data,
//                     params,
//                     headers: customHeaders,
//                     withCredentials,
//                 });

//                 if (onSuccess) {
//                     onSuccess(response.data);
//                 }

//                 return response.data;
//             } catch (err) {
//                 const error = err as Error | AxiosError;
//                 setError(error);

//                 if (onError) {
//                     onError(error);
//                 }

//                 throw error;
//             } finally {
//                 setLoading(false);
//             }
//         },
//         [axiosInstance],
//     );

//     return { fetchData, loading, error };
// }
