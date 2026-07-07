import type { Metadata } from "next";
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
  title: "jjin-matjib",
  description: "찐맛집",
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
      <body className="h-full flex flex-col max-w-[375px] mx-auto bg-background">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
