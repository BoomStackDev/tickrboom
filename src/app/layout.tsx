import type { Metadata } from 'next';
import { Montserrat, Roboto_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import './globals.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
  weight: ['300', '800', '900'],
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: 'TickrBoom',
  description: 'Stock Market Dice Game',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${montserrat.variable} ${robotoMono.variable}`} suppressHydrationWarning>
      <body className="font-[family-name:var(--font-montserrat)] antialiased tb-bg tb-text">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
