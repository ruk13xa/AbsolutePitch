import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import NavBar from "@/components/NavBar";
import ThreeBackground from "@/components/ThreeBackground";
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
  title: "절대음감 트레이너",
  description: "음, 인터벌, 코드를 듣고 맞추며 절대음감을 훈련하는 웹앱",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      {/*
        No background color on <html>/<body>: a color set there gets
        propagated to the root "canvas" background per the CSS spec, which
        always paints below every element regardless of z-index — including
        the Three.js layer below — hiding it completely. Painting the
        fallback color on its own fixed div keeps stacking order normal.
      */}
      <body className="relative min-h-full flex flex-col">
        <div className="fixed inset-0 -z-20 bg-zinc-50 dark:bg-black" aria-hidden="true" />
        <ThreeBackground />
        <div className="relative z-10 flex min-h-full flex-1 flex-col">
          <NavBar />
          <main className="flex flex-1 flex-col">{children}</main>
        </div>
      </body>
    </html>
  );
}
