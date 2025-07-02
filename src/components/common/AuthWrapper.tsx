'use client';

import { usePathname } from 'next/navigation';
import ClientLayout from './ClientLayout';
import styled from 'styled-components';
import { useAuth } from '@/context/AuthProvider';

const LoadingContainer = styled.div`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #0a0a0a;
    color: #ffffff;
`;

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <LoadingContainer>Loading...</LoadingContainer>;
    }

    const authRoutes = ['/login', '/forgot-password'];
    const isAuthPage = authRoutes.includes(pathname);

    if (!isAuthenticated && !isAuthPage) {
        return <LoadingContainer>Redirecting...</LoadingContainer>;
    }

    if (isAuthPage || !isAuthenticated) {
        return <>{children}</>;
    }

    return <ClientLayout>{children}</ClientLayout>;
}
