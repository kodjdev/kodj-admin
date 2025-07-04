'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { themeColors } from '@/themes/themeColors';

type DashboardOverviewProps = {
    stats: {
        totalUsers: number;
        activeEvents: number;
        pastEvents: number;
        jobPosts: number;
        speakers: number;
        news: number;
        userGrowth: number;
        eventGrowth: number;
        jobGrowth: number;
        newsGrowth: number;
    };
    loading: boolean;
    onRefresh?: () => void;
};

const DashboardContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${themeColors.spacing.xl};
`;

const Header = styled.div`
    margin-bottom: ${themeColors.spacing.lg};
`;

const Title = styled.h1`
    color: #ffffff;
    font-size: ${themeColors.typography.headings.desktop.h3.fontSize}px;
    font-weight: ${themeColors.typography.headings.desktop.h3.fontWeight};
    margin: 0 0 ${themeColors.spacing.sm} 0;
`;

const Subtitle = styled.p`
    color: #6a6a6a;
    font-size: ${themeColors.typography.body.regular.fontSize}px;
    margin: 0;
`;

const StatsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: ${themeColors.spacing.lg};

    @media (max-width: ${themeColors.breakpoints.desktop}) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: ${themeColors.breakpoints.mobile}) {
        grid-template-columns: 1fr;
    }
`;

const StatCard = styled.div`
    background-color: #1a1a1a;
    border: 1px solid #2a2a2a;
    border-radius: ${themeColors.cardBorder.lg};
    padding: ${themeColors.spacing.xl};
    transition: all ${themeColors.transitions.normal};

    &:hover {
        border-color: #3a3a3a;
        transform: translateY(-2px);
    }
`;

const StatHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: ${themeColors.spacing.sm};
`;

const StatLabel = styled.p`
    color: #b3b3b3;
    font-size: ${themeColors.typography.body.regular.fontSize}px;
    font-weight: 400;
    margin: 0 0 ${themeColors.spacing.md} 0;
`;

const StatValue = styled.h2`
    color: #ffffff;
    font-size: 36px;
    font-weight: 600;
    margin: 0 0 ${themeColors.spacing.lg} 0;
    line-height: 1;
`;

const StatChange = styled.div<{ $positive?: boolean }>`
    display: inline-flex;
    align-items: center;
    gap: ${themeColors.spacing.xs};
    color: ${(props) => (props.$positive ? '#10b981' : '#ef4444')};
    font-size: ${themeColors.typography.body.small.fontSize}px;
    font-weight: 500;

    span:first-child {
        font-size: 16px;
    }
`;

const StatFooter = styled.div`
    display: flex;
    align-items: center;
    gap: ${themeColors.spacing.sm};
    margin-top: ${themeColors.spacing.md};
`;

const StatDescription = styled.p`
    color: #6a6a6a;
    font-size: ${themeColors.typography.body.small.fontSize}px;
    margin: 0;
`;

const TrendIcon = styled.span`
    color: #6a6a6a;
    font-size: 20px;
`;

const ChartContainer = styled.div`
    background-color: #1a1a1a;
    border-radius: ${themeColors.cardBorder.lg};
    padding: ${themeColors.spacing.xl};
    margin-top: ${themeColors.spacing.xl};
`;

const ChartHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${themeColors.spacing.lg};
`;

const ChartTitle = styled.h3`
    color: ${themeColors.colors.neutral.white};
    font-size: ${themeColors.typography.headings.desktop.h4.fontSize}px;
    font-weight: ${themeColors.typography.headings.desktop.h4.fontWeight};
    margin: 0;
`;

const ChartSubtitle = styled.p`
    color: ${themeColors.colors.neutral.gray500};
    font-size: ${themeColors.typography.body.small.fontSize}px;
    margin: ${themeColors.spacing.xs} 0 0 0;
`;

const TabContainer = styled.div`
    display: flex;
    gap: ${themeColors.spacing.xs};
    background-color: #2a2a2a;
    padding: ${themeColors.spacing.xs};
    border-radius: ${themeColors.cardBorder.md};
`;

const Tab = styled.button<{ $active?: boolean }>`
    padding: ${themeColors.spacing.sm} ${themeColors.spacing.md};
    background-color: ${(props) => (props.$active ? themeColors.colors.neutral.gray600 : 'transparent')};
    border: none;
    border-radius: ${themeColors.cardBorder.sm};
    color: ${(props) => (props.$active ? themeColors.colors.secondary.contrast : themeColors.colors.neutral.gray500)};
    font-size: ${themeColors.typography.body.small.fontSize}px;
    font-weight: ${(props) => (props.$active ? '500' : '400')};
    cursor: pointer;
    transition: all ${themeColors.transitions.normal};

    &:hover:not(:disabled) {
        background-color: ${(props) =>
            props.$active ? themeColors.colors.neutral.gray700 : themeColors.colors.neutral.gray200};
    }
`;

export default function DashboardOverview({ stats, loading, onRefresh }: DashboardOverviewProps) {
    const [activeTab, setActiveTab] = useState<'3months' | '30days' | '7days'>('30days');

    const statsData = [
        {
            label: 'Total Events',
            value:
                stats.activeEvents + stats.pastEvents > 0
                    ? (stats.activeEvents + stats.pastEvents).toString()
                    : 'Loading...',
            change: `${stats.eventGrowth > 0 ? '+' : ''}${Math.abs(stats.eventGrowth)}%`,
            positive: stats.eventGrowth > 0,
            trend: stats.eventGrowth > 0 ? 'Growing event participation' : 'Event participation declining',
            description: `${stats.activeEvents} upcoming, ${stats.pastEvents} completed`,
            trendIcon: stats.eventGrowth > 0 ? '📈' : '📉',
        },
        {
            label: 'Registered Users',
            value: loading ? 'Loading...' : stats.totalUsers.toLocaleString(),
            change: `+${stats.userGrowth}%`,
            positive: true,
            trend: 'User base expanding',
            description: 'Active platform members',
            trendIcon: '📈',
        },
        {
            label: 'Total Speakers',
            value: loading ? 'Loading...' : stats.speakers.toString(),
            change: '+18%',
            positive: true,
            trend: 'Speaker network growing',
            description: 'Verified event speakers',
            trendIcon: '📈',
        },
        {
            label: 'Job Postings',
            value: loading ? 'Loading...' : stats.jobPosts.toString(),
            change: `+${stats.jobGrowth}%`,
            positive: true,
            trend: 'Strong job market activity',
            description: 'Active job opportunities',
            trendIcon: '📈',
        },
    ];

    return (
        <DashboardContainer>
            <Header>
                <div>
                    <Title>Dashboard</Title>
                    <Subtitle>Monitor your platform performance and key metrics</Subtitle>
                </div>
            </Header>

            <StatsGrid>
                {statsData.map((stat, index) => (
                    <StatCard key={index}>
                        <StatHeader>
                            <StatLabel>{stat.label}</StatLabel>
                            <StatChange $positive={stat.positive}>
                                <span>{stat.positive ? '↗' : '↘'}</span>
                                <span>{stat.change}</span>
                            </StatChange>
                        </StatHeader>
                        <StatValue>{stat.value}</StatValue>
                        <StatFooter>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                    <span style={{ color: '#ffffff', fontSize: '14px' }}>{stat.trend}</span>
                                    <TrendIcon>{stat.trendIcon}</TrendIcon>
                                </div>
                                <StatDescription>{stat.description}</StatDescription>
                            </div>
                        </StatFooter>
                    </StatCard>
                ))}
            </StatsGrid>

            <ChartContainer>
                <ChartHeader>
                    <div>
                        <ChartTitle>Platform Activity</ChartTitle>
                        <ChartSubtitle>User engagement over time</ChartSubtitle>
                    </div>
                    <TabContainer>
                        <Tab $active={activeTab === '7days'} onClick={() => setActiveTab('7days')}>
                            Last 7 days
                        </Tab>
                        <Tab $active={activeTab === '30days'} onClick={() => setActiveTab('30days')}>
                            Last 30 days
                        </Tab>
                        <Tab $active={activeTab === '3months'} onClick={() => setActiveTab('3months')}>
                            Last 3 months
                        </Tab>
                    </TabContainer>
                </ChartHeader>
                <div
                    style={{
                        height: '300px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: themeColors.colors.neutral.gray400,
                    }}
                >
                    Chart visualization would go here
                </div>
            </ChartContainer>
        </DashboardContainer>
    );
}
