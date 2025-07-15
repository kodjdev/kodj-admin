import styled from 'styled-components';
import { themeColors } from '@/themes/themeColors';
import { useEffect, useState } from 'react';
import { message } from 'antd';

type Stat = {
    value: number;
    change: number;
};

type Stats = {
    totalUsers: Stat;
    revenue: Stat;
    newSignups: Stat;
    activeSessions: Stat;
};

type ChartDataItem = {
    name: string;
    users: number;
};

export const PageContainer = styled.div`
    padding: ${themeColors.spacing.xl};
    background-color: ${themeColors.dark.background};
`;

export const StatsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: ${themeColors.spacing.lg};
`;

export const StatCard = styled.div`
    background-color: ${themeColors.dark.cardBackground};
    border-radius: ${themeColors.cardBorder.lg};
    padding: ${themeColors.spacing.lg};
    box-shadow: ${themeColors.shadows.md};
    transition: transform ${themeColors.transitions.normal} ease-in-out;

    &:hover {
        transform: translateY(-5px);
    }
`;

export const StatTitle = styled.h3`
    font-size: 1rem;
    color: ${themeColors.dark.textSecondary};
    margin: 0 0 ${themeColors.spacing.sm} 0;
`;

export const StatValue = styled.p`
    font-size: 2.5rem;
    font-weight: 600;
    color: ${themeColors.dark.text};
    margin: 0;
`;

export const StatChange = styled.span<{ isPositive: boolean }>`
    font-size: 0.9rem;
    color: ${({ isPositive }) => (isPositive ? themeColors.colors.success.main : themeColors.colors.error.main)};
    margin-left: ${themeColors.spacing.md};
`;

export const ChartContainer = styled.div`
    background-color: ${themeColors.dark.cardBackground};
    border-radius: ${themeColors.cardBorder.lg};
    padding: ${themeColors.spacing.lg};
    margin-top: ${themeColors.spacing.xl};
    box-shadow: ${themeColors.shadows.md};
`;

export const ChartTitle = styled.h2`
    font-size: 1.25rem;
    color: ${themeColors.dark.text};
    margin: 0 0 ${themeColors.spacing.lg} 0;
`;

export const ChartPlaceholder = styled.div`
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${themeColors.dark.surfaceSecondary};
    border-radius: ${themeColors.cardBorder.md};
    color: ${themeColors.dark.placeholder};
`;

export const ChartBarsContainer = styled.div`
    display: flex;
    align-items: flex-end;
    height: 250px;
    gap: 8px;
    padding: 16px;
    border-radius: ${themeColors.cardBorder.md};
    background-color: ${themeColors.dark.surfaceSecondary};
`;

export const ChartBar = styled.div<{ height: number }>`
    flex: 1;
    background-color: ${themeColors.colors.primary.main};
    height: ${({ height }) => height}%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    border-radius: 4px 4px 0 0;
`;

const mockStats: Stats = {
    totalUsers: { value: 1250, change: 5.2 },
    revenue: { value: 89400, change: -1.8 },
    newSignups: { value: 320, change: 12.0 },
    activeSessions: { value: 850, change: 3.5 },
};

const mockChartData: ChartDataItem[] = [
    { name: 'Jan', users: 400 },
    { name: 'Feb', users: 300 },
    { name: 'Mar', users: 500 },
    { name: 'Apr', users: 450 },
    { name: 'May', users: 600 },
    { name: 'Jun', users: 750 },
];

export default function StatisticsPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [chartData, setChartData] = useState<ChartDataItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                setError(null);
                await new Promise((resolve) => setTimeout(resolve, 1000));
                setStats(mockStats);
                setChartData(mockChartData);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
                messageApi.error(errorMessage);
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [messageApi]);

    if (loading) {
        return <PageContainer>Loading statistics...</PageContainer>;
    }

    if (error) {
        return <PageContainer>Error: {error}</PageContainer>;
    }

    return (
        <>
            {contextHolder}
            <PageContainer>
                <h1>Dashboard</h1>
                <p>Monitor your platform performance and key metrics</p>

                <StatsGrid>
                    <StatCard>
                        <StatTitle>Total Users</StatTitle>
                        <StatValue>{stats!.totalUsers.value.toLocaleString()}</StatValue>
                        <StatChange isPositive={stats!.totalUsers.change >= 0}>
                            {stats!.totalUsers.change >= 0 ? '▲' : '▼'} {Math.abs(stats!.totalUsers.change)}%
                        </StatChange>
                    </StatCard>
                    <StatCard>
                        <StatTitle>Revenue</StatTitle>
                        <StatValue>${stats!.revenue.value.toLocaleString()}</StatValue>
                        <StatChange isPositive={stats!.revenue.change >= 0}>
                            {stats!.revenue.change >= 0 ? '▲' : '▼'} {Math.abs(stats!.revenue.change)}%
                        </StatChange>
                    </StatCard>
                    <StatCard>
                        <StatTitle>New Signups</StatTitle>
                        <StatValue>{stats!.newSignups.value.toLocaleString()}</StatValue>
                        <StatChange isPositive={stats!.newSignups.change >= 0}>
                            {stats!.newSignups.change >= 0 ? '▲' : '▼'} {Math.abs(stats!.newSignups.change)}%
                        </StatChange>
                    </StatCard>
                    <StatCard>
                        <StatTitle>Active Sessions</StatTitle>
                        <StatValue>{stats!.activeSessions.value.toLocaleString()}</StatValue>
                        <StatChange isPositive={stats!.activeSessions.change >= 0}>
                            {stats!.activeSessions.change >= 0 ? '▲' : '▼'} {Math.abs(stats!.activeSessions.change)}%
                        </StatChange>
                    </StatCard>
                </StatsGrid>

                <ChartContainer>
                    <ChartTitle>User Growth Over Time</ChartTitle>
                    <ChartBarsContainer>
                        {chartData.map((dataPoint) => (
                            <ChartBar key={dataPoint.name} height={(dataPoint.users / 1000) * 100}>
                                <span
                                    style={{ fontSize: '0.75rem', color: themeColors.dark.text, marginBottom: '4px' }}
                                >
                                    {dataPoint.users}
                                </span>
                                <span style={{ fontSize: '0.75rem', color: themeColors.dark.textSecondary }}>
                                    {dataPoint.name}
                                </span>
                            </ChartBar>
                        ))}
                    </ChartBarsContainer>
                </ChartContainer>
            </PageContainer>
        </>
    );
}
