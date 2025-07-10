import React, { useState, useEffect, useRef } from 'react';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import { useStatisticsService } from '@/services/api/statisticsService';

export default function HomePage() {
    const { getStatistics } = useStatisticsService();
    const hasFetched = useRef(false);

    const [stats, setStats] = useState({
        totalUsers: 0,
        totalEvents: 0,
        totalSpeakers: 0,
        activeEvents: 0,
        pastEvents: 0,
        userGrowth: 12.5,
        eventGrowth: 8.2,
        speakerGrowth: 15.0,
    });
    const [loading, setLoading] = useState(true);

    const fetchDashboardData = async () => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        try {
            setLoading(true);

            const statisticsResponse = await getStatistics();

            const statsData = statisticsResponse.data?.data || {
                totalSpeakers: 0,
                totalUsers: 0,
                totalEvents: 0,
            };

            const activeEvents = Math.floor(statsData.totalEvents * 0.3);
            const pastEvents = statsData.totalEvents - activeEvents;

            const calculateMockGrowth = (value: number) => {
                if (value === 0) return 0;
                if (value < 10) return Math.random() * 30 + 5;
                if (value < 50) return Math.random() * 20 + 8;
                if (value < 100) return Math.random() * 15 + 10;
                return Math.random() * 12 + 12;
            };

            setStats({
                totalUsers: statsData.totalUsers,
                totalEvents: statsData.totalEvents,
                totalSpeakers: statsData.totalSpeakers,
                activeEvents,
                pastEvents,
                userGrowth: calculateMockGrowth(statsData.totalUsers),
                eventGrowth: calculateMockGrowth(statsData.totalEvents),
                speakerGrowth: calculateMockGrowth(statsData.totalSpeakers),
            });
        } catch (error) {
            console.error('Failed to fetch statistics data:', error);

            setStats({
                totalUsers: 0,
                totalEvents: 0,
                totalSpeakers: 0,
                activeEvents: 0,
                pastEvents: 0,
                userGrowth: 0,
                eventGrowth: 0,
                speakerGrowth: 0,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        hasFetched.current = false;
        await fetchDashboardData();
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    return <DashboardOverview stats={stats} loading={loading} onRefresh={handleRefresh} />;
}
