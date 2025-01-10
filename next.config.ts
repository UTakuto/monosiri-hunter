/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config: any) => {
        config.cache = false; // キャッシュを無効化
        return config;
    },
    // 実験的な機能を有効化
    // experimental: {
    //     optimizeCss: true,
    // },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "firebasestorage.googleapis.com",
                port: "",
                pathname: "/v0/b/**",
            },
        ],
    },
};

module.exports = nextConfig;
