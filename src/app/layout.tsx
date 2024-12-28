import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ClashDeckPro - Clash Royale Deck Builder",
  description:
    "Create personalized Clash Royale decks with AI-powered recommendations based on your playstyle and stats",
  applicationName: "ClashDeckPro",
  keywords: [
    "Clash Royale",
    "Deck Builder",
    "Strategy",
    "Gaming",
    "ClashDeckPro",
  ],
  authors: [{ name: "ClashDeckPro Team" }],
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/icon/android-icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/icon/apple-icon-57x57.png", sizes: "57x57", type: "image/png" },
      { url: "/icon/apple-icon-60x60.png", sizes: "60x60", type: "image/png" },
      { url: "/icon/apple-icon-72x72.png", sizes: "72x72", type: "image/png" },
      { url: "/icon/apple-icon-76x76.png", sizes: "76x76", type: "image/png" },
      { url: "/icon/apple-icon-114x114.png", sizes: "114x114", type: "image/png" },
      { url: "/icon/apple-icon-120x120.png", sizes: "120x120", type: "image/png" },
      { url: "/icon/apple-icon-144x144.png", sizes: "144x144", type: "image/png" },
      { url: "/icon/apple-icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/icon/apple-icon-180x180.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "apple-touch-icon", url: "/icon/apple-icon-180x180.png" },
    ],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  other: {
    "msapplication-TileColor": "#ffffff",
    "msapplication-TileImage": "/icon/ms-icon-144x144.png",
  },
  themeColor: "#000000",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ClashDeckPro",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="ClashDeckPro" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="icon" href="/icon/favicon.ico" sizes="any" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/icon/apple-icon-180x180.png"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
