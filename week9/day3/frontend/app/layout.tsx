import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Cricket Chatbot — Memory-Powered AI Agent',
  description:
    'Ask questions about cricket stats across Test, ODI and T20 formats. The AI remembers your past conversations and resolves follow-up questions using memory.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>{children}</body>
    </html>
  );
}
