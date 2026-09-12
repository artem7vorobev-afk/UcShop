import Link from 'next/link';
import { ChevronRight, Zap } from 'lucide-react';
import { ServiceIcon } from '@/components/mini-app/ServiceIcon';

const popular: { name: string; href: string; icon: string; color?: string }[] = [
  { name: 'PUBG Mobile', href: '/mini-app/product/pubg-mobile-uc', icon: 'pubg' },
  { name: 'Steam', href: '/mini-app/product/steam-wallet', icon: 'steam', color: 'ffffff' },
  { name: 'Free Fire', href: '/mini-app/product/free-fire-diamonds', icon: 'garena' },
  { name: 'Discord', href: '/mini-app/product/discord-nitro', icon: 'discord' },
  { name: 'App Store & iTunes', href: '/mini-app/product/apple-itunes', icon: 'appstore' },
  { name: 'Xbox Game Pass', href: '/mini-app/category/gift-cards', icon: 'xbox' },
  { name: 'Xbox GiftCards', href: '/mini-app/product/xbox-wallet', icon: 'xbox' },
  { name: 'Roblox', href: '/mini-app/product/roblox-robux', icon: 'roblox', color: 'ffffff' },
  { name: 'PlayStation', href: '/mini-app/product/playstation-wallet', icon: 'playstation' },
  { name: 'Mobile Legends', href: '/mini-app/product/mobile-legends-diamonds', icon: 'mobilelegendsbangbang' },
  { name: 'Genshin Impact', href: '/mini-app/product/genshin-impact-crystals', icon: 'genshinimpact' },
  { name: 'Honkai: Star Rail', href: '/mini-app/product/honkai-star-rail-shards', icon: 'honkaistarrail' },
  { name: 'Delta Force', href: '/mini-app/category/pc-games', icon: 'deltaforce' },
  { name: 'PUBG: BATTLEGROUNDS', href: '/mini-app/category/pc-games', icon: 'pubg' },
  { name: 'PUBG: New State', href: '/mini-app/category/mobile-games', icon: 'pubg' },
];

export default function MiniAppHomePage() {
  return (
    <div className="space-y-7 animate-fade-up">
      {/* Hero — PUBG Mobile */}
      <Link href="/mini-app/product/pubg-mobile-uc" className="block active:scale-[0.98] transition-transform">
        <div className="relative overflow-hidden rounded-3xl border border-[#e50914]/25 bg-gradient-to-br from-[#1a0507] via-[#12060a] to-background p-6 glow-red">
          <div
            aria-hidden
            className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#e50914]/20 blur-3xl"
          />
          <div className="relative">
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-[#e50914]/15 border border-[#e50914]/30 px-3 py-1 text-[11px] font-semibold text-[#ff4d5e]">
              <Zap className="h-3 w-3" />
              Популярное
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight">PUBG Mobile</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              UC для PUBG Mobile — мгновенное пополнение
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#ff2d42] to-[#e50914] px-5 py-2.5 text-sm font-bold text-white shadow-[0_4px_24px_rgba(229,9,20,0.4)]">
              Купить UC
              <ChevronRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </Link>

      {/* Popular products */}
      <section>
        <h3 className="mb-3 text-base font-bold tracking-tight">Популярные товары</h3>
        <div className="grid grid-cols-5 gap-2.5">
          {popular.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="group flex flex-col items-center gap-2 active:scale-95 transition-transform"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.04] transition-colors group-hover:border-[#e50914]/30 group-hover:bg-[#e50914]/10">
                <ServiceIcon slug={item.icon} name={item.name} color={item.color} />
              </div>
              <span className="w-full truncate text-center text-[10px] font-medium leading-tight text-muted-foreground">
                {item.name}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
