import type { Metadata } from "next";
import "./globals.css";
import NotificationProvider from "@/components/NotificationProvider";

export const metadata: Metadata = {
  title: "SocialMedia - Real-time Social Platform",
  description: "A modern real-time social media platform built with NestJS and Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning>
        <NotificationProvider>
          <main>{children}</main>
        </NotificationProvider>
      </body>
    </html>
  );
}
