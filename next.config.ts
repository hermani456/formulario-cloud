import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    domains: ["portfolio-container-bucket.s3.us-east-1.amazonaws.com"],
    formats: ["image/webp"],
    minimumCacheTTL: 86400,
  },
};

export default nextConfig;
