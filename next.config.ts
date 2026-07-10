import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 진단용 임시 설정: dev에서 StrictMode 이중 마운트 때문에 지도가 재생성되며 깜빡이는지 확인
  reactStrictMode: false,
  allowedDevOrigins: ["172.30.1.80"],
  turbopack: {
    root: process.cwd(),
  },
  images: {
    localPatterns: [{ pathname: "/assets/**" }, { pathname: "/api/places/photo" }],
  },
};

export default nextConfig;
