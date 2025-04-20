import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  devIndicators: {
    buildActivity: false, // Disable build activity indicator
  },
};

export default nextConfig;
