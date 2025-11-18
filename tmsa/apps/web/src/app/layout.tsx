import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { Providers } from './providers';
import { getLocalePayload } from '@/lib/i18n/server';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'TMSA Africa Transport Hub',
  description: 'Continental mission control for tracking, payments and logistics intelligence.',
  metadataBase: new URL('https://tmsa.africa'),
  openGraph: {
    title: 'TMSA – Africa Transport Hub',
    description: 'Realtime visibility for mining houses, brokers and fleets.',
    url: 'https://tmsa.africa',
    siteName: 'TMSA',
    images: [{ url: '/og.png', width: 1200, height: 630 }],
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const payload = await getLocalePayload();

  return (
    <html lang={payload.locale}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers {...payload}>
          <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col gap-6 p-4 lg:flex-row">
            <Sidebar />
            <main className="flex-1 pb-16">
              <TopBar />
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
