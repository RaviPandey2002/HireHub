/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.cache = {
      type: 'filesystem',
      compression: 'brotli',
      store: 'pack',
      maxMemoryGenerations: 1,
    };
    return config;
  },
};

export default nextConfig;
