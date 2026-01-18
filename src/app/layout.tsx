import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { LayoutWrapper } from "@/components/layout/layout-wrapper";
import { SessionProvider } from "@/components/auth/session-provider";
import { ErrorBoundary } from "@/components/ui/error-boundary";

export const metadata: Metadata = {
  title: "金刚经研究与教学平台",
  description: "基于 AI 的智能佛学学习平台，提供《金刚经》经文研读、AI讲师问答、系统课程、共修社区等功能",
  keywords: ["金刚经", "般若波罗蜜", "佛学", "AI", "在线学习", "修行"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="antialiased font-sans">
        <SessionProvider>
          <ThemeProvider>
            <ErrorBoundary>
              <LayoutWrapper>{children}</LayoutWrapper>
            </ErrorBoundary>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
