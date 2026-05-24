import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Symptom Checker | Healthcare Supplement Assistant',
  description:
    'Describe your symptoms and our AI will suggest the best supplements and healthcare products for you. Powered by OpenAI.',
  keywords: 'symptom checker, supplements, healthcare, AI, vitamins, minerals',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
