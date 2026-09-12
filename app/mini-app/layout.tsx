import { Metadata } from 'next';
import { TelegramAuth } from '@/components/telegram/TelegramAuth';
import { BottomNav } from '@/components/mini-app/BottomNav';
import { MiniAppHeader } from '@/components/mini-app/MiniAppHeader';

export const metadata: Metadata = {
  title: 'UcShop1 Mini App',
  description: 'Магазин цифровых товаров в Telegram',
};

export default function MiniAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mini-app min-h-[100dvh] bg-background font-sans">
      <TelegramAuth />

      {/* Ambient red glow at top */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(229,9,20,0.18),transparent)]"
      />

      {/* Header */}
      <MiniAppHeader />

      {/* Content */}
      <main className="relative mx-auto max-w-md px-4 pb-28">{children}</main>

      <BottomNav />
    </div>
  );
}
