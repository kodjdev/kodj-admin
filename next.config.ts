import type { NextConfig } from 'next';

const nextConfig = {
    reactStrictMode: true,
    compiler: {
        styledComponents: true,
    },
    env: {
        NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://server.kodj.online/api/v1',
    },
};

module.exports = nextConfig;
