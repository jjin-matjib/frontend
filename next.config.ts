import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["172.30.1.80"],
  images: {
    localPatterns: [{ pathname: "/assets/**" }, { pathname: "/api/places/photo" }],
  },
};

export default nextConfig;
