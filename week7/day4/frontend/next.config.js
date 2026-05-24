/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['media.graphassets.com', 'us-east-1.graphassets.com'],
    unoptimized: true,
  },
};

module.exports = nextConfig;
