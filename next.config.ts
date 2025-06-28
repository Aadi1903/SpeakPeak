import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint:{
    ignoreDuringBuilds: true,
  },
  typescripts: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
