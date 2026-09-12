import { Metadata } from 'next';
import { TelegramAuth } from '@/components/telegram/TelegramAuth';
import { BottomNav } from '@/components/mini-app/BottomNav';

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
      <header className="sticky top-0 z-40 safe-top">
        <div className="mx-auto flex max-w-md items-center justify-between px-5 py-4">
          <span className="text-lg font-extrabold tracking-tight">
            Uc<span className="text-[#ff2d42]">Shop</span>
          </span>
          <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-[11px] font-medium text-muted-foreground">
            Digital Market
          </span>
        </div>
      </header>

      {/* Content */}
      <main className="relative mx-auto max-w-md px-4 pb-28">{children}</main>

      <BottomNav />
    </div>
  );
}
