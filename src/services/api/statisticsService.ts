import { useMemo } from 'react';
import useAxios from '@/hooks/useAxios';
import { ApiResponse } from '@/types/common';

export type StatisticsData = {
    totalSpeakers: number;
    totalUsers: number;
    totalEvents: number;
};

export const useStatisticsService = () => {
    const fetchData = useAxios();

    return useMemo(
        () => ({
            getStatistics: async (): Promise<ApiResponse<StatisticsData>> => {
                return await fetchData<StatisticsData>({
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
