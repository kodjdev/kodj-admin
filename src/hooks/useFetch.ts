import createAxiosInstance from '@/services/axiosInstance';
import { ApiResponse } from '@/types/common';
import { AxiosError } from 'axios';
import { useCallback, useState } from 'react';

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

export default function useFetch() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const axiosInstance = createAxiosInstance();

    const fetchData = useCallback(
        async <T>(options: FetchOptions<T>): Promise<ApiResponse<T>> => {
            const {
                endpoint,
                method = 'GET',
                data,
                params,
                customHeaders,
                onSuccess,
                onError,
                withCredentials = true,
            } = options;

            setLoading(true);
            setError(null);

            try {
                const response = await axiosInstance.request<ApiResponse<T>>({
                    url: endpoint,
                    method,
                    data,
                    params,
                    headers: customHeaders,
                    withCredentials,
                });

                if (onSuccess) {
                    onSuccess(response.data);
                }

                return response.data;
            } catch (err) {
                const error = err as Error | AxiosError;
                setError(error);

                if (onError) {
                    onError(error);
                }

                throw error;
            } finally {
                setLoading(false);
            }
        },
        [axiosInstance],
    );

    return { fetchData, loading, error };
}
