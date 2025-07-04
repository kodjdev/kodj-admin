import { ApiResponse, User, UserDetails } from '@/types/common';
import { useMemo } from 'react';
import useAxios from '@/hooks/useAxios';

type LoginRequest = {
    email: string;
    password: string;
    ipAddress: string;
    deviceType: string;
};

type LoginResponse = {
    accessToken: string;
    refreshToken: string;
    user: {
        id: number;
        email: string;
        name: string;
        role: string;
    };
};

type TokenResponse = {
    data: {
        access_token: string;
        refresh_token: string;
    };
};

export const useAuthService = () => {
    const fetchData = useAxios();

    return useMemo(
        () => ({
            login: async (credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
                return fetchData<LoginResponse>({
                    endpoint: '/auth/login',
                    method: 'POST',
                    data: {
                        email: credentials.email,
                        password: credentials.password,
                        ipAddress: credentials.ipAddress || 'unknown',
                        deviceType: credentials.deviceType || 'web',
                    },
                    customHeaders: {
                        'Content-Type': 'application/json',
                    },
                });
            },

            verifyLoginOtp: async (email: string, otp: string) => {
                return fetchData<TokenResponse>({
                    endpoint: '/auth/verify-login-otp',
                    method: 'POST',
                    data: { email, otp },
                    customHeaders: {
                        'Content-Type': 'application/json',
                    },
                });
            },

            refreshToken: async (): Promise<ApiResponse<TokenResponse>> => {
                const refreshToken = localStorage.getItem('refresh_token');

                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                return await fetchData<TokenResponse>({
                    endpoint: '/auth/token/refresh',
                    method: 'POST',
                    customHeaders: {
                        Authorization: `Bearer ${refreshToken}`,
                        'Content-Type': 'application/json',
                    },
                });
            },

            getUserDetails: async (token: string): Promise<ApiResponse<UserDetails>> => {
                return fetchData<UserDetails>({
                    endpoint: '/users/details',
                    method: 'GET',
                    customHeaders: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            },
        }),
        [fetchData],
    );
};
