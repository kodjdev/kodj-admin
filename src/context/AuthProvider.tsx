'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthService } from '@/services/api/authService';
import { User } from '@/types/common';

type AuthContextType = {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: User | null;
    login: (accessToken: string, refreshToken: string, user: User) => void;
    logout: () => void;
    error: string | null;
    verifyOtp: (email: string, otp: string) => Promise<void>;
    otpSent: boolean;
    sendOtp: (email: string, password: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [otpSent, setOtpSent] = useState(false);

    const router = useRouter();
    const pathname = usePathname();
    const authService = useAuthService();

    const sendOtp = async (email: string, password: string) => {
        try {
            setError(null);
            await authService.login({
                email,
                password,
                ipAddress: window.location.hostname,
                deviceType: 'web',
            });
            setOtpSent(true);
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'OTP request failed');
            throw err;
        }
    };

    const verifyOtp = async (email: string, otp: string) => {
        try {
            setError(null);
            const response = await authService.verifyLoginOtp(email, otp);

            if (response.data.access_token && response.data.refresh_token) {
                const { access_token, refresh_token } = response.data;

                localStorage.setItem('access_token', access_token);
                localStorage.setItem('refresh_token', refresh_token);

                setUser(user);
                setIsAuthenticated(true);
                setOtpSent(false);
                router.push('/');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Invalid OTP');
            throw err;
        }
    };

    const login = (accessToken: string, refreshToken: string, user: User) => {
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
        setUser(user);
        setIsAuthenticated(true);
        setError(null);
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
        setIsAuthenticated(false);
        setError(null);
        router.push('/login');
    };

    const validateAuth = useCallback(async () => {
        const token = localStorage.getItem('access_token');
        if (!token) return setIsLoading(false);

        try {
            const response = await authService.validateToken();
            if (response.data.valid && response.data.user?.role === 'ADMIN') {
                setUser(response.data.user);
                setIsAuthenticated(true);
            } else {
                logout();
                setError('Access denied. Admin privileges required.');
            }
        } catch (err) {
            console.error('Token validation failed:', err);
            logout();
        } finally {
            setIsLoading(false);
        }
    }, [authService]);

    useEffect(() => {
        validateAuth();
    }, [validateAuth]);

    useEffect(() => {
        if (!isLoading) {
            const publicRoutes = ['/login', '/register', '/forgot-password'];
            const isPublicRoute = publicRoutes.includes(pathname);

            if (!isAuthenticated && !isPublicRoute) {
                router.push('/login');
            } else if (isAuthenticated && pathname === '/login') {
                router.push('/');
            }
        }
    }, [isAuthenticated, isLoading, pathname, router]);

    useEffect(() => {
        if (!isAuthenticated) return;

        const interval = setInterval(
            async () => {
                try {
                    const response = await authService.refreshToken();
                    if (response.data) {
                        localStorage.setItem('access_token', response.data.accessToken);
                        localStorage.setItem('refresh_token', response.data.refreshToken);
                    }
                } catch (err) {
                    console.error('Token refresh failed:', err);
                    logout();
                }
            },
            15 * 60 * 1000,
        );

        return () => clearInterval(interval);
    }, [isAuthenticated]);

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                isLoading,
                user,
                login,
                logout,
                error,
                verifyOtp,
                otpSent,
                sendOtp,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
