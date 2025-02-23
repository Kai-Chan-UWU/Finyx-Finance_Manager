/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: {
            allowedOrigins: ["*"]
        }
    },
    images: {
        unoptimized: true
    },
    webpack: (config) => {
        config.resolve.fallback = {
            ...config.resolve.fallback,
            fs: false,
            path: false,
        };
        return config;
    },
};

export default nextConfig;