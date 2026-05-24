import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Multi-Agent Research Assistant',
  description:
    'An AI-powered research assistant that uses a multi-agent workflow to analyze documents, rank sources, and synthesize answers using TF-IDF, TextRank, and contradiction detection.',
  keywords: ['research', 'multi-agent', 'AI', 'document analysis', 'NLP'],
  authors: [{ name: 'DevSquad 26' }],
  openGraph: {
    title: 'Multi-Agent Research Assistant',
    description: 'Smart document research powered by a 6-agent workflow',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-gradient-bg text-text-primary antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
