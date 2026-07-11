import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Providers } from "@/providers";
import "./globals.css";

const pretendard = localFont({
  src: "../../public/fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  weight: "45 920",
  display: "swap",
});

export const metadata: Metadata = {
  title: "먹지도",
  description: "먹지도 — 맛집 검색과 만남 권역 추천",
  applicationName: "먹지도",
  appleWebApp: {
    capable: true,
    title: "먹지도",
    statusBarStyle: "default",
  },
  icons: {
    apple: "/apple-touch-icon.png",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#faf8f5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${pretendard.variable} h-full antialiased bg-muted`}
    >
      {/* h-full(고정 높이)이면 스크롤 시 배경이 첫 화면까지만 칠해져 min-h-full 사용 */}
      <body className="min-h-full flex flex-col w-full mx-auto sm:max-w-[375px] bg-background">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
