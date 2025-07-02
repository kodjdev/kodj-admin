'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthService } from '@/services/api/authService';
import { User } from '@/types/common';
import { isApiError } from '@/types/error';

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
    const [tempEmail, setTempEmail] = useState<string>('');

    const router = useRouter();
    const pathname = usePathname();
    const authService = useAuthService();

    const logout = useCallback(() => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
        setIsAuthenticated(false);
        setError(null);
        setOtpSent(false);
        router.push('/login');
    }, [router]);

    const loadUserFromToken = async (token: string): Promise<User | null> => {
        try {
            const userResponse = await authService.getUserDetails(token);
            console.log('User details response:', userResponse);

            if (userResponse.data) {
                const userData = userResponse.data.data;

                if (userData.oauthProvider !== 'LOCAL') {
                    throw new Error('Access denied. Admin privileges required.');
                }

                const userInfo: User = {
                    id: userData.id,
                    email: userData.email,
                    name: userData.name || `${userData.firstName} ${userData.lastName}`.trim() || userData.email,
                    username: userData.username || userData.email,
                    role: userData.role,
                    createdAt: userData.createdAt,
                };

                return userInfo;
            }
            return null;
        } catch (error) {
            console.error('Error loading user data:', error);
            throw error;
        }
    };

    const sendOtp = async (email: string, password: string) => {
        try {
            setError(null);
            setTempEmail(email);
            await authService.login({
                email,
                password,
                ipAddress: window.location.hostname,
                deviceType: 'web',
            });
            setOtpSent(true);
        } catch (err: unknown) {
            if (isApiError(err)) {
                setError(err.response?.data?.message || err.message || 'Failed to send OTP');
            } else if (err instanceof Error) {
                setError(err.message || 'An unexpected error occurred');
            } else {
                setError('An unexpected error occurred');
            }
            throw err;
        }
    };

    const verifyOtp = async (email: string, otp: string) => {
        try {
            setError(null);
            const response = await authService.verifyLoginOtp(email, otp);
            console.log('OTP verification response:', response);

            if (response.data.data.access_token && response.data.data.refresh_token) {
                const { access_token, refresh_token } = response.data.data;

                localStorage.setItem('access_token', access_token);
                localStorage.setItem('refresh_token', refresh_token);

                try {
                    const userInfo = await loadUserFromToken(access_token);
                    if (userInfo) {
                        setUser(userInfo);
                        setIsAuthenticated(true);
                        setOtpSent(false);
                        router.push('/');
                    } else {
                        throw new Error('User information could not be loaded');
                    }
                } catch (error) {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    setError('Failed to load user information');
                    throw error;
                }
            }
        } catch (err: unknown) {
            if (isApiError(err)) {
                setError(err.response?.data?.message || err.message || 'Invalid OTP');
            } else if (err instanceof Error) {
                setError(err.message || 'An unexpected error occurred');
            } else {
                setError('An unexpected error occurred');
            }
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

    const validateAuth = useCallback(async () => {
        const token = localStorage.getItem('access_token');

        if (!token) {
            setIsLoading(false);
            return;
        }

        try {
            const userInfo = await loadUserFromToken(token);
            if (userInfo) {
                setUser(userInfo);
                setIsAuthenticated(true);
            } else {
                logout();
            }
        } catch (err) {
            console.error('Auth validation failed:', err);
            logout();
        } finally {
            setIsLoading(false);
        }
    }, [logout]);

    useEffect(() => {
        validateAuth();
    }, []);

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
                    const refreshToken = localStorage.getItem('refresh_token');
                    if (!refreshToken) {
                        logout();
                        return;
                    }

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
            /* refresh token every 15 minutes */
            15 * 60 * 1000,
        );

        return () => clearInterval(interval);
    }, [isAuthenticated, authService, logout]);

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
