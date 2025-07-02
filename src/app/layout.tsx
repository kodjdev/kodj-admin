import StyledComponentsRegistry from '@/lib/StyledComponentsRegistry';
import { GlobalStyles } from '@/styles/globalStyles';
import { AuthProvider } from '@/context/AuthProvider';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import AuthWrapper from '@/components/common/AuthWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Kodj Admin Panel',
    description: 'Admin panel for managing meetups, news, and job posts',
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <StyledComponentsRegistry>
                    <GlobalStyles />
                    <AuthProvider>
                        <AuthWrapper>{children}</AuthWrapper>
                    </AuthProvider>
                </StyledComponentsRegistry>
            </body>
        </html>
    );
}
