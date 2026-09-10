import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {};
const nextConfig = {
  webpack: (config) => {
    config.resolve.modules.push(path.resolve(__dirname));
    config.resolve.alias = {
      ...config.resolve.alias,
      "@/components": path.resolve(__dirname, "src/app/components"),
    };
    return config;
  },
};

export default nextConfig;
