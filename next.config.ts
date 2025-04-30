import { config } from "@/config";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  devIndicators: false,
  allowedDevOrigins: [`${config.api_url}`],
};

export default nextConfig;
