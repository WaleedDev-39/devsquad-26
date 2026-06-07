import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MediBot — Voice-Enabled Healthcare Chatbot",
  description:
    "AI-powered healthcare products chatbot with voice input. Ask about medications, supplements, and health products using your voice or keyboard.",
  keywords: "healthcare chatbot, medical assistant, voice chatbot, pharmacy, medications",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
