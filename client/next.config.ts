import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: "/*",
      },
      {
        pathname: "/**",
      },
      {
        pathname: "/**/*.jpg",
      },
      {
        pathname: "/**/*.png",
      },
      {
        pathname: "/assets/**",
      },
    ],
  },
};

export default nextConfig;
