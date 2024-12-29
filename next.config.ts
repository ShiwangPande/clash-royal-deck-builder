import type { NextConfig } from 'next'
import withPWA from 'next-pwa'

const runtimeCaching = [
  {
    urlPattern: /^https:\/\/api-assets\.clashroyale\.com\/.*/i,
    handler: 'CacheFirst',
    options: {
      cacheName: 'clash-royale-assets',
      expiration: {
        maxEntries: 500,
        maxAgeSeconds: 60 * 60 * 24 * 365
      }
    }
  },
  {
    urlPattern: /^https:\/\/api\.clashroyale\.com\/v1\/.*/i,
    handler: 'NetworkFirst',
    options: {
      cacheName: 'clash-royale-api',
      expiration: {
        maxEntries: 50,
        maxAgeSeconds: 60 * 5 // 5 minutes
      }
    }
  },
  {
    urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
    handler: 'CacheFirst',
    options: {
      cacheName: 'image-cache',
      expiration: {
        maxEntries: 100,
        maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
      }
    }
  }
]

const config: NextConfig = {
  images: {
    domains: ['api-assets.clashroyale.com'],
    unoptimized: true
  },
  webpack: (config) => {
    config.resolve = config.resolve || {}
    config.resolve.alias = {
      ...config.resolve.alias,
      'workbox-routing': 'workbox-routing/build/workbox-routing',
      'workbox-strategies': 'workbox-strategies/build/workbox-strategies',
      'workbox-expiration': 'workbox-expiration/build/workbox-expiration',
      'workbox-cacheable-response': 'workbox-cacheable-response/build/workbox-cacheable-response'
    }
    return config
  },
  output: 'export'
}

export default withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  runtimeCaching,
  buildExcludes: [/middleware-manifest\.json$/]
})(config)