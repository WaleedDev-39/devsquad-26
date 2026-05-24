import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "AI Assignment Checker | Grading Reimagined",
  description: "Automated, AI-powered evaluation of student assignment submissions based on teacher guidelines.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body suppressHydrationWarning className={`${inter.variable} font-sans antialiased bg-slate-900 text-slate-50 min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
