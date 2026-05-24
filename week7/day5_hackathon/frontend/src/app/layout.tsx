import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Providers from './providers';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: 'StockPOS — Raw Material POS System',
  description: 'Production-grade POS with recipe-based raw material inventory management',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body style={{ margin: 0, background: '#F8FAFF' }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
