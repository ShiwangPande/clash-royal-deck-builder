import type { NextConfig } from "next";
import withPWA from "next-pwa";
const nextConfig: NextConfig = {
  images: {
    domains: ['api-assets.clashroyale.com'],
  },
};

export default withPWA({
  dest: 'public', // Service worker and related files output directory
  disable: process.env.NODE_ENV === 'development', // Disable PWA in development mode
  ...nextConfig, // Include the existing configuration
});