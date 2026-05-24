/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
      { protocol: 'https', hostname: 'source.unsplash.com' },
      // Allow locally-served backend uploads in development
      { protocol: 'http', hostname: 'localhost', port: '5000' },
      // Allow Render-served backend uploads in production
      { protocol: 'https', hostname: 'week6-eccomerce-store-backend.onrender.com' },
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://week6-eccomerce-store-backend.onrender.com/api',
    NEXT_PUBLIC_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL || 'https://week6-eccomerce-store-backend.onrender.com',
  },
};

module.exports = nextConfig;
