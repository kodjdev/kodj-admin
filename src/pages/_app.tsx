import type { AppProps } from 'next/app';
import { GlobalStyles } from '@/styles/globalStyles';
import { AuthProvider } from '@/context/AuthProvider';
import AuthWrapper from '@/components/common/AuthWrapper';
import { RecoilRoot } from 'recoil'; // ✅ Move here

export default function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <GlobalStyles />
            <RecoilRoot>
                <AuthProvider>
                    <AuthWrapper>
                        <Component {...pageProps} />
                    </AuthWrapper>
                </AuthProvider>
            </RecoilRoot>
        </>
    );
}
