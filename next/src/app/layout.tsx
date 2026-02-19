import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { BackgroundVideo } from "@/components/BackgroundVideo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Siggmond",
  description: "Senior systems & platform engineer building developer tools that make teams faster and systems safer.",
  metadataBase: new URL("https://siggmond.github.io"),
  openGraph: {
    type: "website",
    siteName: "Siggmond",
    title: "Siggmond",
    description: "Senior systems & platform engineer building developer tools that make teams faster and systems safer.",
  },
  twitter: {
    card: "summary",
    title: "Siggmond",
    description: "Senior systems & platform engineer building developer tools that make teams faster and systems safer.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-foreground`}
      >
        <BackgroundVideo />
        <div className="site-content">{children}</div>
      </body>
    </html>
  );
}
