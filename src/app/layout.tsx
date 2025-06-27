import { Inter } from 'next/font/google';
import StyledComponentsRegistry from '@/lib/StyledComponentsRegistry';
import ClientLayout from '@/components/common/ClientLayout';
import type { Metadata } from 'next';
import { GlobalStyles } from '@/styles/globalStyles';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Kodj Admin Panel',
    description: 'Admin panel for managing meetups, news, and job posts',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <StyledComponentsRegistry>
                    <GlobalStyles />
                    <ClientLayout>{children}</ClientLayout>
                </StyledComponentsRegistry>
            </body>
        </html>
    );
}
