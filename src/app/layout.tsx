import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FrameOne | Entertainment Industry Professional Network",
  description: "Connect with talent, crew, and production professionals. Build teams. Create projects. Get hired. The entertainment industry's premier professional platform.",
  keywords: ["entertainment", "film", "tv", "production", "casting", "talent", "crew", "hiring"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-zinc-950 text-white antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}