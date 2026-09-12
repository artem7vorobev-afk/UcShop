'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

export function MiniAppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === '/mini-app';

  // Native Telegram BackButton — shows in the Telegram chrome on sub-pages
  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    const bb = tg?.BackButton;
    if (!bb) return;

    const handler = () => router.back();
    if (isHome) {
      bb.hide();
    } else {
      bb.show();
      bb.onClick(handler);
    }
    return () => {
      bb.offClick?.(handler);
      bb.hide?.();
    };
  }, [isHome, router]);

  return (
    <header className="sticky top-0 z-40 safe-top">
      <div className="mx-auto flex max-w-md items-center gap-3 px-5 py-4">
        {!isHome && (
          <button
            onClick={() => router.back()}
            aria-label="Назад"
            className="-ml-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] transition-transform active:scale-90"
          >
            <ChevronLeft className="h-[18px] w-[18px]" />
          </button>
        )}
        <span className="text-lg font-extrabold tracking-tight">
          Uc<span className="text-[#ff2d42]">Shop</span>
        </span>
      </div>
    </header>
  );
}
