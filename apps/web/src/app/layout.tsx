import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TMSA - Africa Transport Hub',
  description: 'Leading transport and logistics platform for Africa',
  keywords: ['transport', 'logistics', 'Africa', 'freight', 'cargo', 'tracking'],
  authors: [{ name: 'TMSA Tech Team' }],
  openGraph: {
    title: 'TMSA - Africa Transport Hub',
    description: 'Leading transport and logistics platform for Africa',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
