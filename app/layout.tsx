import type { Metadata, Viewport } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin', 'cyrillic'], variable: '--font-inter' });
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin', 'cyrillic-ext'],
  variable: '--font-jakarta',
});

export const metadata: Metadata = {
  title: 'UcShop1 - Магазин цифровых товаров',
  description: 'Магазин цифровых товаров и игровых пополнений',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  interactiveWidget: 'resizes-content',
  themeColor: '#0a0a0c',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={`${inter.variable} ${jakarta.variable} font-sans`}>
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-background">
          {children}
        </div>
      </body>
    </html>
  );
}
