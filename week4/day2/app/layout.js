import { League_Spartan } from 'next/font/google';
import './globals.css';

const spartan = League_Spartan({ 
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-spartan',
});

export const metadata = {
  title: 'Job Listings',
  description: 'Frontend Mentor - Job listings with filtering challenge',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${spartan.variable} antialiased bg-neutral-bg min-h-screen text-neutral-very-dark`}>
        {children}
      </body>
    </html>
  );
}
