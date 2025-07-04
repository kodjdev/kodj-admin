import { useMemo } from 'react';
import useAxios from '@/hooks/useAxios';
import { ApiResponse } from '@/types/common';

export type StatisticsData = {
    totalSpeakers: number;
    totalUsers: number;
    totalEvents: number;
};

export type StatisticsResponse = {
    message: string;
    data: StatisticsData;
    statusCode: number;
};

export const useStatisticsService = () => {
    const fetchData = useAxios();

    return useMemo(
        () => ({
            getStatistics: async (): Promise<ApiResponse<StatisticsResponse>> => {
                return await fetchData<StatisticsResponse>({
                    endpoint: '/public/statistics',
                    method: 'GET',
                    customHeaders: {
                        'Content-Type': 'application/json',
                    },
                });
            },
        }),
        [fetchData],
    );
};
