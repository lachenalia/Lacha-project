import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    BE_URL: process.env.BE_URL,
  },
};

export default nextConfig;
