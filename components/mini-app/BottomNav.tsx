'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, Receipt, User } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

const items = [
  { href: '/mini-app', label: 'Главная', icon: Home, exact: true },
  { href: '/mini-app/categories', label: 'Каталог', icon: LayoutGrid },
  { href: '/mini-app/orders', label: 'Заказы', icon: Receipt },
  { href: '/mini-app/profile', label: 'Профиль', icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-4 safe-bottom">
      <div className="mx-auto max-w-md rounded-full border border-white/[0.08] bg-[#121216]/90 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-around px-2 py-2">
          {items.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-0.5 rounded-full px-4 py-1.5 transition-all duration-200 active:scale-95',
                  active ? 'text-[#ff4d5e]' : 'text-muted-foreground'
                )}
              >
                <Icon
                  className={cn('h-5 w-5 transition-transform', active && 'scale-110')}
                  strokeWidth={active ? 2.4 : 1.8}
                />
                <span className="text-[10px] font-medium leading-none">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
