import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["172.30.1.80"],
  turbopack: {
    root: process.cwd(),
  },
  images: {
    localPatterns: [{ pathname: "/assets/**" }, { pathname: "/api/places/photo" }],
  },
};

export default nextConfig;
