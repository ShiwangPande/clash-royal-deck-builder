import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.clashdeckpro.app',
  appName: 'ClashDeck Pro',
  webDir: 'out',
  bundledWebRuntime: false, // Ensures the Capacitor runtime is not bundled in the app
  server: {
    cleartext: true, // Enable HTTP requests for debugging (remove for production)
  },
  android: {
    allowMixedContent: true, // Allow mixed content (HTTP and HTTPS)
    backgroundColor: '#FFFFFF', // Set default background color
    webContentsDebuggingEnabled: true, // Enable web debugging tools
  },
  ios: {
    cordovaLinkerFlags: ['-ObjC'], // For Cordova plugin compatibility
    contentInset: 'always', // Manage safe area insets on iOS devices
  },
  loggingBehavior: 'production' // Set logging behavior to 'production' or 'debug'
};

export default config;
