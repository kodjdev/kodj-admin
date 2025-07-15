import React, { useEffect, useRef, useState, useCallback } from 'react';
import styled from 'styled-components';
import * as d3 from 'd3';
import { themeColors } from '@/themes/themeColors';
import { ActiveTabs } from '@/components/dashboard/DashboardOverview';
import { StatisticsData } from '@/services/api/statisticsService';

type DataPoint = {
    date: Date;
    users: number;
    events: number;
    speakers: number;
};

const ChartContainer = styled.div`
    width: 100%;
    height: 100%;
    position: relative;
`;

const ChartSvg = styled.svg`
    width: 100%;
    height: 100%;

    .grid-line {
        stroke: ${themeColors.dark.surfaceSecondary};
        stroke-width: 1;
        stroke-dasharray: 3, 3;
    }

    .axis-text {
        fill: ${themeColors.dark.textSecondary};
        font-size: ${themeColors.typography.body.tiny.fontSize}px;
        font-family: inherit;
    }

    .axis-domain,
    .axis-tick {
        stroke: ${themeColors.dark.surfaceSecondary};
    }

    .focus-line {
        stroke: ${themeColors.dark.placeholder};
        stroke-width: 1;
        stroke-dasharray: 3, 3;
    }

    .legend-text {
        fill: ${themeColors.dark.textSecondary};
        font-size: ${themeColors.typography.body.tiny.fontSize}px;
        font-family: inherit;
    }
`;

const Tooltip = styled.div`
    position: fixed;
    background: ${themeColors.dark.surface};
    border: 1px solid ${themeColors.dark.border};
    border-radius: ${themeColors.cardBorder.md};
    padding: ${themeColors.spacing.md};
    font-size: ${themeColors.typography.body.tiny.fontSize}px;
    color: ${themeColors.dark.text};
    pointer-events: none;
    z-index: 10000;
    opacity: 0;
    transition: opacity ${themeColors.transitions.fast};
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5);
    max-width: 200px;
    word-wrap: break-word;
    white-space: nowrap;
`;

const chartTheme = {
    colors: {
        users: themeColors.colors.success.main,
        events: themeColors.colors.primary.main,
        speakers: themeColors.colors.secondary.main,
    },
    gradients: {
        users: {
            start: { color: themeColors.colors.success.main, opacity: 0.3 },
            end: { color: themeColors.colors.success.main, opacity: 0.05 },
        },
        events: {
            start: { color: themeColors.colors.primary.main, opacity: 0.3 },
            end: { color: themeColors.colors.primary.main, opacity: 0.05 },
        },
        totalSpeakers: {
            start: { color: themeColors.colors.secondary.main, opacity: 0.3 },
            end: { color: themeColors.colors.secondary.main, opacity: 0.05 },
        },
    },
};

export default function PlatformActivityChart({ activeTab, stats }: { activeTab: ActiveTabs; stats: StatisticsData }) {
    const svgRef = useRef<SVGSVGElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 300 });

    const generateChartData = useCallback(() => {
        const { totalUsers, totalEvents, totalSpeakers } = stats;

        const safeUsers = totalUsers || 0;
        const safeEvents = totalEvents || 0;
        const safeSpeakers = totalSpeakers || 0;

        let dataPoints = [];
        const now = new Date();

        if (activeTab === '7days') {
            dataPoints = Array.from({ length: 7 }, (_, i) => {
                const date = new Date(now);
                date.setDate(date.getDate() - (6 - i));
                return {
                    date,
                    users: Math.floor(safeUsers * (0.7 + Math.random() * 0.3)),
                    events: Math.floor(safeEvents * (0.5 + Math.random() * 0.5)),
                    speakers: Math.floor(safeSpeakers * (0.8 + Math.random() * 0.2)),
                };
            });
        } else if (activeTab === '30days') {
            dataPoints = Array.from({ length: 30 }, (_, i) => {
                const date = new Date(now);
                date.setDate(date.getDate() - (29 - i));
                return {
                    date,
                    users: Math.floor(safeUsers * (0.5 + Math.random() * 0.5)),
                    events: Math.floor(safeEvents * (0.3 + Math.random() * 0.7)),
                    speakers: Math.floor(safeSpeakers * (0.6 + Math.random() * 0.4)),
                };
            });
        } else {
            dataPoints = Array.from({ length: 90 }, (_, i) => {
                const date = new Date(now);
                date.setDate(date.getDate() - (89 - i));
                return {
                    date,
                    users: Math.floor(safeUsers * (0.3 + Math.random() * 0.7)),
                    events: Math.floor(safeEvents * (0.2 + Math.random() * 0.8)),
                    speakers: Math.floor(safeSpeakers * (0.4 + Math.random() * 0.6)),
                };
            });
        }

        return dataPoints;
    }, [stats, activeTab]);

    useEffect(() => {
        const handleResize = () => {
            if (svgRef.current && svgRef.current.parentElement) {
                const container = svgRef.current.parentElement;
                setDimensions({
                    width: container.clientWidth,
                    height: 300,
                });
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (!dimensions.width) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();

        const data = generateChartData();

        const margin = { top: 20, right: 15, bottom: 25, left: 20 };
        const width = dimensions.width - margin.left - margin.right;
        const height = dimensions.height - margin.top - margin.bottom;

        const g = svg
            .attr('width', dimensions.width)
            .attr('height', dimensions.height)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const xScale = d3
            .scaleTime()
            .domain(d3.extent(data, (d) => d.date) as [Date, Date])
            .range([0, width]);

        const yScale = d3
            .scaleLinear()
            .domain([0, d3.max(data, (d) => Math.max(d.users || 0, d.events || 0, d.speakers || 0)) || 0])
            .range([height, 0]);

        const lineUsers = d3
            .line<DataPoint>()
            .x((d) => xScale(d.date))
            .y((d) => yScale(d.users))
            .curve(d3.curveMonotoneX);

        const lineEvents = d3
            .line<DataPoint>()
            .x((d) => xScale(d.date))
            .y((d) => yScale(d.events))
            .curve(d3.curveMonotoneX);

        const lineSpeakers = d3
            .line<DataPoint>()
            .x((d) => xScale(d.date))
            .y((d) => yScale(d.speakers))
            .curve(d3.curveMonotoneX);

        g.selectAll('.grid-line')
            .data(yScale.ticks(5))
            .enter()
            .append('line')
            .attr('class', 'grid-line')
            .attr('x1', 0)
            .attr('x2', width)
            .attr('y1', (d) => yScale(d))
            .attr('y2', (d) => yScale(d));

        const xAxis = d3
            .axisBottom(xScale)
            .tickFormat((domainValue) =>
                d3.timeFormat(activeTab === '7days' ? '%a' : activeTab === '30days' ? '%m/%d' : '%b')(
                    domainValue as Date,
                ),
            );

        const yAxis = d3.axisLeft(yScale).tickFormat(d3.format('.0f'));

        g.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(xAxis)
            .selectAll('text')
            .attr('class', 'axis-text');

        g.append('g').call(yAxis).selectAll('text').attr('class', 'axis-text');

        g.selectAll('.domain').attr('class', 'axis-domain');

        g.selectAll('.tick line').attr('class', 'axis-tick');

        const defs = svg.append('defs');

        const gradientUsers = defs
            .append('linearGradient')
            .attr('id', 'gradient-users')
            .attr('gradientUnits', 'userSpaceOnUse')
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('x2', 0)
            .attr('y2', height);

        gradientUsers
            .append('stop')
            .attr('offset', '0%')
            .attr('stop-color', chartTheme.gradients.users.start.color)
            .attr('stop-opacity', chartTheme.gradients.users.start.opacity);

        gradientUsers
            .append('stop')
            .attr('offset', '100%')
            .attr('stop-color', chartTheme.gradients.users.end.color)
            .attr('stop-opacity', chartTheme.gradients.users.end.opacity);

        const gradientEvents = defs
            .append('linearGradient')
            .attr('id', 'gradient-events')
            .attr('gradientUnits', 'userSpaceOnUse')
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('x2', 0)
            .attr('y2', height);

        gradientEvents
            .append('stop')
            .attr('offset', '0%')
            .attr('stop-color', chartTheme.gradients.events.start.color)
            .attr('stop-opacity', chartTheme.gradients.events.start.opacity);

        gradientEvents
            .append('stop')
            .attr('offset', '100%')
            .attr('stop-color', chartTheme.gradients.events.end.color)
            .attr('stop-opacity', chartTheme.gradients.events.end.opacity);

        const gradientSpeakers = defs
            .append('linearGradient')
            .attr('id', 'gradient-speakers')
            .attr('gradientUnits', 'userSpaceOnUse')
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('x2', 0)
            .attr('y2', height);

        gradientSpeakers
            .append('stop')
            .attr('offset', '0%')
            .attr('stop-color', chartTheme.gradients.totalSpeakers.start.color)
            .attr('stop-opacity', chartTheme.gradients.totalSpeakers.start.opacity);

        gradientSpeakers
            .append('stop')
            .attr('offset', '100%')
            .attr('stop-color', chartTheme.gradients.totalSpeakers.end.color)
            .attr('stop-opacity', chartTheme.gradients.totalSpeakers.end.opacity);

        const areaUsers = d3
            .area<DataPoint>()
            .x((d) => xScale(d.date))
            .y0(height)
            .y1((d) => yScale(d.users))
            .curve(d3.curveMonotoneX);

        const areaEvents = d3
            .area<DataPoint>()
            .x((d) => xScale(d.date))
            .y0(height)
            .y1((d) => yScale(d.events))
            .curve(d3.curveMonotoneX);

        const areaSpeakers = d3
            .area<DataPoint>()
            .x((d) => xScale(d.date))
            .y0(height)
            .y1((d) => yScale(d.speakers))
            .curve(d3.curveMonotoneX);

        g.append('path').datum(data).attr('fill', 'url(#gradient-users)').attr('d', areaUsers);

        g.append('path').datum(data).attr('fill', 'url(#gradient-events)').attr('d', areaEvents);

        g.append('path').datum(data).attr('fill', 'url(#gradient-speakers)').attr('d', areaSpeakers);

        g.append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', chartTheme.colors.users)
            .attr('stroke-width', 2)
            .attr('d', lineUsers);

        g.append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', chartTheme.colors.events)
            .attr('stroke-width', 2)
            .attr('d', lineEvents);

        g.append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', chartTheme.colors.speakers)
            .attr('stroke-width', 2)
            .attr('d', lineSpeakers);

        const overlay = g
            .append('rect')
            .attr('width', width)
            .attr('height', height)
            .attr('fill', 'none')
            .attr('pointer-events', 'all');

        const focus = g.append('g').style('display', 'none');

        focus.append('line').attr('class', 'focus-line').attr('y1', 0).attr('y2', height);

        focus.append('circle').attr('class', 'focus-dot-users').attr('r', 4).attr('fill', chartTheme.colors.users);

        focus.append('circle').attr('class', 'focus-dot-events').attr('r', 4).attr('fill', chartTheme.colors.events);

        focus
            .append('circle')
            .attr('class', 'focus-dot-speakers')
            .attr('r', 4)
            .attr('fill', chartTheme.colors.speakers);

        overlay
            .on('mouseover', () => focus.style('display', null))
            .on('mouseout', () => {
                focus.style('display', 'none');
                if (tooltipRef.current) {
                    tooltipRef.current.style.opacity = '0';
                }
            })
            .on('mousemove', function (event) {
                const [mouseX] = d3.pointer(event);
                const x0 = xScale.invert(mouseX);
                const i = d3.bisector<DataPoint, Date>((d) => d.date).left(data, x0, 1);
                const d0 = data[i - 1];
                const d1 = data[i];
                if (!d0 || !d1) return;
                const d = x0.getTime() - d0.date.getTime() > d1.date.getTime() - x0.getTime() ? d1 : d0;

                focus.select('.focus-line').attr('x1', xScale(d.date)).attr('x2', xScale(d.date));
                focus.select('.focus-dot-users').attr('cx', xScale(d.date)).attr('cy', yScale(d.users));
                focus.select('.focus-dot-events').attr('cx', xScale(d.date)).attr('cy', yScale(d.events));
                focus.select('.focus-dot-speakers').attr('cx', xScale(d.date)).attr('cy', yScale(d.speakers));

                if (tooltipRef.current) {
                    const svgRect = svgRef.current?.getBoundingClientRect();
                    if (!svgRect) return;

                    tooltipRef.current.innerHTML = `
                        <div style="font-weight: 600; margin-bottom: 8px; color: ${themeColors.dark.text};">
                            ${d3.timeFormat('%b %d, %Y')(d.date)}
                        </div>
                        <div style="display: flex; align-items: center; margin-bottom: 4px;">
                            <div style="width: 12px; height: 12px; background: ${chartTheme.colors.users}; border-radius: 50%; margin-right: 8px;"></div>
                            <span>Users: ${d.users}</span>
                        </div>
                        <div style="display: flex; align-items: center; margin-bottom: 4px;">
                            <div style="width: 12px; height: 12px; background: ${chartTheme.colors.events}; border-radius: 50%; margin-right: 8px;"></div>
                            <span>Events: ${d.events}</span>
                        </div>
                        <div style="display: flex; align-items: center;">
                            <div style="width: 12px; height: 12px; background: ${chartTheme.colors.speakers}; border-radius: 50%; margin-right: 8px;"></div>
                            <span>Speakers: ${d.speakers}</span>
                        </div>
                    `;
                    const tooltipX = svgRect.left + xScale(d.date) + margin.left + 10;
                    const tooltipY = svgRect.top + yScale(d.users) + margin.top - 10;

                    tooltipRef.current.style.left = tooltipX + 'px';
                    tooltipRef.current.style.top = tooltipY + 'px';
                    tooltipRef.current.style.opacity = '1';
                }
            });
    }, [activeTab, stats, dimensions, generateChartData, chartTheme]);

    return (
        <ChartContainer>
            <ChartSvg ref={svgRef} />
            <Tooltip
                ref={tooltipRef}
                style={{
                    position: 'fixed',
                    zIndex: 10000,
                    pointerEvents: 'none',
                }}
            />
        </ChartContainer>
    );
}
