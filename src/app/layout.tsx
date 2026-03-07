import type { Metadata } from 'next';
import { Montserrat, Roboto_Mono } from 'next/font/google';
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
  description: 'A stock market dice game',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${montserrat.variable} ${robotoMono.variable}`}>
      <body className="font-[family-name:var(--font-montserrat)] antialiased">
        {children}
      </body>
    </html>
  );
}
