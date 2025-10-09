import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gloo.impact.xyz',
      },
    ],
  },
};

export default nextConfig;
