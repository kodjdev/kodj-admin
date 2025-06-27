'use client';

import React from 'react';
import styled from 'styled-components';
import { themeColors } from '@/themes/themeColors';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LayoutContainer = styled.div`
    min-height: 100vh;
    display: flex;
    background-color: #0a0a0a;
`;

const Sidebar = styled.aside`
    width: 280px;
    background-color: #1a1a1a;
    border-right: 1px solid #2a2a2a;
    padding: ${themeColors.spacing.xl} ${themeColors.spacing.lg};
    position: fixed;
    height: 100vh;
    overflow-y: auto;

    @media (max-width: ${themeColors.breakpoints.tablet}) {
        display: none;
    }
`;

const MainContent = styled.main`
    flex: 1;
    margin-left: 280px;
    padding: ${themeColors.spacing.xl};
    background-color: #0a0a0a;

    @media (max-width: ${themeColors.breakpoints.tablet}) {
        margin-left: 0;
        padding: ${themeColors.spacing.md};
    }
`;

const Logo = styled.h1`
    color: #ffffff;
    font-size: ${themeColors.typography.headings.desktop.h5.fontSize}px;
    font-weight: ${themeColors.typography.headings.desktop.h5.fontWeight};
    margin-bottom: ${themeColors.spacing.xxl};
    padding-left: ${themeColors.spacing.sm};
`;

const NavSection = styled.div`
    margin-bottom: ${themeColors.spacing.xl};
`;

const NavGroup = styled.div`
    margin-bottom: ${themeColors.spacing.xxl};
`;

const NavGroupTitle = styled.p`
    color: #6a6a6a;
    font-size: ${themeColors.typography.body.small.fontSize}px;
    font-weight: 500;
    margin-bottom: ${themeColors.spacing.md};
    padding-left: ${themeColors.spacing.sm};
    text-transform: capitalize;
`;

const StyledNavLink = styled(Link)<{ $active?: boolean }>`
    display: flex;
    align-items: center;
    gap: ${themeColors.spacing.md};
    padding: ${themeColors.spacing.sm} ${themeColors.spacing.md};
    color: ${(props) => (props.$active ? '#ffffff' : '#b3b3b3')};
    background-color: ${(props) => (props.$active ? 'rgba(255, 255, 255, 0.1)' : 'transparent')};
    border-radius: ${themeColors.cardBorder.md};
    text-decoration: none;
    margin-bottom: ${themeColors.spacing.xs};
    transition: all ${themeColors.transitions.normal};
    font-size: ${themeColors.typography.body.regular.fontSize}px;

    &:hover {
        background-color: rgba(255, 255, 255, 0.05);
        color: #ffffff;
    }
`;

const NavIcon = styled.span`
    font-size: 20px;
    width: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

type LayoutProps = {
    children: React.ReactNode;
};

export default function ClientLayout({ children }: LayoutProps) {
    const pathname = usePathname();

    const mainNavItems = [
        { href: '/', label: 'Dashboard', icon: '⚡' },
        { href: '/news', label: 'News', icon: '📰' },
        { href: '/meetups', label: 'Meetups', icon: '📅' },
        { href: '/jobs', label: 'Job Posts', icon: '💼' },
    ];

    const documentItems = [
        { href: '/data-library', label: 'Data Library', icon: '📚' },
        { href: '/reports', label: 'Reports', icon: '📊' },
    ];

    return (
        <LayoutContainer>
            <Sidebar>
                <Logo>Kodj Admin</Logo>

                <NavSection>
                    <NavGroup>
                        <NavGroupTitle>Home</NavGroupTitle>
                        {mainNavItems.map((item) => (
                            <StyledNavLink key={item.href} href={item.href} $active={pathname === item.href}>
                                <NavIcon>{item.icon}</NavIcon>
                                {item.label}
                            </StyledNavLink>
                        ))}
                    </NavGroup>

                    <NavGroup>
                        <NavGroupTitle>Documents</NavGroupTitle>
                        {documentItems.map((item) => (
                            <StyledNavLink key={item.href} href={item.href} $active={pathname === item.href}>
                                <NavIcon>{item.icon}</NavIcon>
                                {item.label}
                            </StyledNavLink>
                        ))}
                    </NavGroup>
                </NavSection>
            </Sidebar>

            <MainContent>{children}</MainContent>
        </LayoutContainer>
    );
}
