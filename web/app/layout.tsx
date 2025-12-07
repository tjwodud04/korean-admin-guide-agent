import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "🇰🇷 한국 행정 서비스 가이드",
  description:
    "OpenAI Agent SDK를 활용한 멀티에이전트 행정 서비스 안내 시스템",
  keywords: ["OpenAI", "Agent SDK", "한국", "행정", "비자", "세금", "건강보험"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
