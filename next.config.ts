import type { NextConfig } from 'next';

const nextConfig = {
    reactStrictMode: true,
    compiler: {
        styledComponents: true,
    },
    env: {
        NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api-test.kodj.dev/api/v1',
    },
    output: 'export',
};

module.exports = nextConfig;
