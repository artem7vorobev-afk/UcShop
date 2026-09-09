import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
  title: 'UcShop1 - Магазин цифровых товаров',
  description: 'Магазин цифровых товаров и игровых пополнений',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-background">
          {children}
        </div>
      </body>
    </html>
  );
}
