import type { NextConfig } from "next";
import withPWA from "next-pwa";

const nextConfig: NextConfig = {
  images: {
    domains: ['api-assets.clashroyale.com'],
  },
  // Other Next.js specific configurations (if any)
};

export default withPWA({
  ...nextConfig, // Include the existing configuration
  dest: 'public', // Service worker and related files output directory
  disable: process.env.NODE_ENV === 'development', // Disable PWA in development mode
  register: true, // Auto register service worker
  skipWaiting: true, // Skip waiting for service worker activation
  // Optionally add additional PWA configurations here
});
