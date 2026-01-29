import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { LayoutWrapper } from "@/components/layout/layout-wrapper";
import { SessionProvider } from "@/components/auth/session-provider";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { SWRegister } from "@/components/pwa/sw-register";

export const metadata: Metadata = {
  title: "佛学经典研究平台",
  description: "基于 AI 的智能佛学学习平台，提供多部佛经的研读、AI讲师问答、系统课程、共修社区等功能",
  keywords: ["金刚经", "六祖坛经", "般若", "佛学", "AI", "在线学习", "修行"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "金刚经",
  },
  icons: {
    icon: "/icon-192.svg",
    apple: "/icon-192.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#f59e0b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon-192.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon-192.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="金刚经" />
      </head>
      <body className="antialiased font-sans">
        <SessionProvider>
          <ThemeProvider>
            <ErrorBoundary>
              <LayoutWrapper>{children}</LayoutWrapper>
              <SWRegister />
            </ErrorBoundary>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
