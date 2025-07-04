import DashboardOverview from '@/components/dashboard/DashboardOverview';
import { useJobService } from '@/services/api/jobService';
import { useMeetupService } from '@/services/api/meetupService';
import { useNewsService } from '@/services/api/newsService';
import { useStatisticsService } from '@/services/api/statisticsService';
import { useEffect, useState } from 'react';

export default function HomePage() {
    const { getNews } = useNewsService();
    const { getMeetups } = useMeetupService();
    const { getJobPosts } = useJobService();
    const { getStatistics } = useStatisticsService();

    const [stats, setStats] = useState({
        totalUsers: 0,
        activeEvents: 0,
        pastEvents: 0,
        jobPosts: 0,
        speakers: 0,
        news: 0,
        userGrowth: 12.5,
        eventGrowth: -8.2,
        jobGrowth: 25.3,
        newsGrowth: 15.7,
    });
    const [loading, setLoading] = useState(true);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            const [newsResponse, meetupsResponse, jobsResponse, statisticsResponse] = await Promise.all([
                getNews(),
                getMeetups(),
                getJobPosts(),
                getStatistics(),
            ]);

            const now = new Date();
            const meetups = meetupsResponse.data || [];
            const activeEvents = meetups.data.content.filter((m) => new Date(m.meetupDate) >= now).length;
            const pastEvents = meetups.data.content.filter((m) => new Date(m.meetupDate) < now).length;

            const statsData = statisticsResponse.data?.data || {
                totalSpeakers: 0,
                totalUsers: 0,
                totalEvents: 0,
            };

            setStats({
                totalUsers: statsData.totalUsers,
                activeEvents,
                pastEvents,
                jobPosts: jobsResponse.data?.length || 0,
                speakers: statsData.totalSpeakers,
                news: newsResponse.data?.content.length || 0,
                userGrowth: 12.5,
                eventGrowth: activeEvents > 0 ? 8.2 : -8.2,
                jobGrowth: 25.3,
                newsGrowth: 15.7,
            });
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);

            setStats({
                totalUsers: 0,
                activeEvents: 0,
                pastEvents: 0,
                jobPosts: 0,
                speakers: 0,
                news: 0,
                userGrowth: 0,
                eventGrowth: 0,
                jobGrowth: 0,
                newsGrowth: 0,
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    return <DashboardOverview stats={stats} loading={loading} onRefresh={fetchDashboardData} />;
}
