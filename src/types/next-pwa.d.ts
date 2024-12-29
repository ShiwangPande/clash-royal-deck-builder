import { NextConfig } from 'next'

declare module 'next-pwa' {
  interface PWAConfig {
    dest?: string
    register?: boolean
    skipWaiting?: boolean
    disable?: boolean
    buildExcludes?: (string | RegExp)[]
    runtimeCaching?: Array<{
      urlPattern: RegExp | string
      handler: string
      options?: {
        cacheName?: string
        expiration?: {
          maxEntries?: number
          maxAgeSeconds?: number
        }
      }
    }>
  }

  function withPWA(config: PWAConfig): (nextConfig: NextConfig) => NextConfig
  export default withPWA
}