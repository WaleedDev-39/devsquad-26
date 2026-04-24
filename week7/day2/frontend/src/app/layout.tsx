import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Circlechain – Save, Buy and Sell Your Blockchain Asset',
  description:
    'Circlechain is the easiest way to manage and trade your cryptocurrency assets. Access token markets, track market trends, and own your blockchain assets.',
  keywords: 'crypto, blockchain, Web3, Bitcoin, Ethereum, BNB, USDT, trading, DeFi',
  openGraph: {
    title: 'Circlechain – Save, Buy and Sell Your Blockchain Asset',
    description: 'The easy to manage and trade your cryptocurrency asset',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
