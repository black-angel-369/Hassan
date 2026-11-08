import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Let phones/tablets on the local network load the dev server (e.g. http://192.168.1.21:3000).
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*"],
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
