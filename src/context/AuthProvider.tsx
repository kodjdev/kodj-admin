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
    verifyOtp: (otp: string) => Promise<boolean>;
    otpSent: boolean;
    sendOtp: (email: string, password: string) => Promise<boolean>;
    resetOtp: () => void;
    resendOtp: (email: string, password: string) => Promise<boolean>;
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

    const loadUserFromToken = useCallback(
        async (token: string): Promise<User | null> => {
            try {
                const userResponse = await authService.getUserDetails(token);
                console.log('User details response:', userResponse);

                if (userResponse.data) {
                    const userData = userResponse.data;

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
        },
        [authService],
    );
    const handleAuthError = useCallback((err: unknown): string => {
        if (isApiError(err)) {
            const status = err.response?.statusCode || 500;
            const message = err.response?.data?.message || err.message || 'An error occurred';

            switch (status) {
                case 400:
                case 403:
                    return 'Incorrect email or password. Please try again.';
                case 401:
                    return 'Invalid credentials. Please check your email and password.';
                case 404:
                    return 'Account not found. Please check your email.';
                case 429:
                    return 'Too many attempts. Please try again later.';
                case 500:
                    return 'Server error. Please try again later.';
                default:
                    return message || 'Login failed. Please try again.';
            }
        } else if (err instanceof Error) {
            return err.message || 'An unexpected error occurred';
        } else {
            return 'An unexpected error occurred';
        }
    }, []);

    const sendOtp = useCallback(
        async (email: string, password: string): Promise<boolean> => {
            try {
                setError(null);
                setTempEmail(email);

                const response = await authService.login({
                    email,
                    password,
                    ipAddress: window.location.hostname,
                    deviceType: 'web',
                });

                if (response.statusCode >= 400) {
                    const errorMessage = handleAuthError({
                        response: {
                            status: response.statusCode,
                            data: response.data,
                        },
                    });
                    setError(errorMessage);
                    return false;
                }

                setOtpSent(true);
                return true;
            } catch (err: unknown) {
                console.error('Login error:', err);
                const errorMessage = handleAuthError(err);
                setError(errorMessage);
                return false;
            }
        },
        [authService, handleAuthError],
    );

    const verifyOtp = useCallback(
        async (otp: string) => {
            try {
                setError(null);
                if (!tempEmail) {
                    setError('Email not found for OTP verification. Please try logging in again.');
                    return false;
                }
                const response = await authService.verifyLoginOtp(tempEmail, Number(otp));
                if (response.data.access_token && response.data.refresh_token) {
                    const { access_token, refresh_token } = response.data;

                    console.log('Response tokens:', { access_token, refresh_token });

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
                    return true;
                }

                setError('Invalid response from server');
                return false;
            } catch (err: unknown) {
                console.error('OTP verification error:', err);
                const errorMessage = handleAuthError(err);
                setError(errorMessage);
                return false;
            }
        },
        [authService, handleAuthError, loadUserFromToken, router, tempEmail],
    );

    const login = useCallback((accessToken: string, refreshToken: string, user: User) => {
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
        setUser(user);
        setIsAuthenticated(true);
        setError(null);
    }, []);

    const validateAuth = useCallback(async () => {
        const accessToken = localStorage.getItem('access_token');
        const refreshTokenValue = localStorage.getItem('refresh_token');

        if (!accessToken && !refreshTokenValue) {
            setIsLoading(false);
            return;
        }

        try {
            if (accessToken) {
                const userInfo = await loadUserFromToken(accessToken);
                if (userInfo) {
                    setUser(userInfo);
                    setIsAuthenticated(true);
                    setIsLoading(false);
                    return;
                }
            }

            /* if access token failed or does not exist, we try to refresh token */
            if (refreshTokenValue) {
                const response = await authService.refreshToken();
                if (response.data?.access_token) {
                    localStorage.setItem('access_token', response.data.access_token);
                    localStorage.setItem('refresh_token', response.data.refresh_token);

                    const userInfo = await loadUserFromToken(response.data.access_token);
                    if (userInfo) {
                        setUser(userInfo);
                        setIsAuthenticated(true);
                        setIsLoading(false);
                        return;
                    }
                }
            }

            logout();
        } catch (err) {
            console.error('Auth validation failed:', err);
            logout();
        } finally {
            setIsLoading(false);
        }
    }, [logout, authService, loadUserFromToken]);

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
                    const refreshToken = localStorage.getItem('refresh_token');
                    if (!refreshToken) {
                        logout();
                        return;
                    }

                    const response = await authService.refreshToken();
                    if (response.data) {
                        localStorage.setItem('access_token', response.data.access_token);
                        localStorage.setItem('refresh_token', response.data.refresh_token);
                    }
                } catch (err) {
                    console.error('Token refresh failed:', err);
                    logout();
                }
            },
            /* refresh token every 23 hours */
            23 * 60 * 60 * 1000,
        );

        return () => clearInterval(interval);
    }, [isAuthenticated, authService, logout]);

    const resendOtp = useCallback(async (): Promise<boolean> => {
        if (!tempEmail) {
            setError('No email found to resend OTP.');
            return false;
        }
        return await sendOtp(tempEmail, '');
    }, [sendOtp, tempEmail]);

    const resetOtp = useCallback(() => {
        setOtpSent(false);
        setTempEmail('');
        setError(null);
    }, []);

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
                resendOtp,
                sendOtp,
                resetOtp,
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
