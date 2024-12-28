import type { NextConfig } from "next";
import withPWA from "next-pwa";

const nextConfig: NextConfig = {
  images: {
    domains: ['api-assets.clashroyale.com'],
  },
};

export default withPWA({
  ...nextConfig, // Include existing configuration
  dest: 'public', // Service worker and related files output directory
  disable: process.env.NODE_ENV === 'development', // Disable PWA in development mode
  register: true, // Auto register service worker
  skipWaiting: true, // Skip waiting for service worker activation
  runtimeCaching: [
    {
      urlPattern: /.*\.(png|jpg|jpeg|gif|webp|svg)/, // Cache images
      handler: 'CacheFirst', // Use CacheFirst strategy for images
      options: {
        cacheName: 'image-cache',
        expiration: {
          maxEntries: 50, // Cache up to 50 images
          maxAgeSeconds: 60 * 60 * 24 * 7, // Cache for 1 week
        },
      },
    },
    // Add other caching strategies if necessary (e.g., for JS, CSS, etc.)
  ],
});
