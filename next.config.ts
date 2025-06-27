import type { NextConfig } from 'next';

const nextConfig = {
    reactStrictMode: true,
    compiler: {
        styledComponents: true,
    },
    env: {
        NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1',
    },
};

module.exports = nextConfig;
