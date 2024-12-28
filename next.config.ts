import type { PWAConfig } from 'next-pwa';
import withPWA from "next-pwa";

// Explicitly type the config without using NextConfig type
const config = {
  images: {
    domains: ['api-assets.clashroyale.com'],
  },
};

// Define PWA config separately
const pwaConfig: PWAConfig = {
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/api-assets\.clashroyale\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'clash-royale-images',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
      },
    }
  ],
};

// Combine configs without explicit typing
const nextConfig = withPWA(pwaConfig)(config);

export default nextConfig;