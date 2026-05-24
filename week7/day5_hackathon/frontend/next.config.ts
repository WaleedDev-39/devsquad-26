import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/order',
        destination: '/orders',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
