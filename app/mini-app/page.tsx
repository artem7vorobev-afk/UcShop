import Link from 'next/link';
import { Star, Gamepad2, Smartphone, Monitor, Gift, Gem, ChevronRight, Zap } from 'lucide-react';

const categories = [
  { slug: 'telegram-stars', name: 'Telegram Stars', icon: Star },
  { slug: 'pubg-mobile', name: 'PUBG Mobile', icon: Gamepad2 },
  { slug: 'steam', name: 'Steam', icon: Gamepad2 },
  { slug: 'roblox', name: 'Roblox', icon: Gamepad2 },
  { slug: 'mobile-games', name: 'Мобильные игры', icon: Smartphone },
  { slug: 'pc-games', name: 'PC игры', icon: Monitor },
  { slug: 'gift-cards', name: 'Подарочные карты', icon: Gift },
  { slug: 'subscriptions', name: 'Подписки', icon: Gem },
];

const featured = [
  {
    slug: 'genshin-impact-crystals',
    name: 'Genshin Impact',
    subtitle: 'Кристаллы Genesis',
    price: 99,
    tag: 'Хит',
  },
  {
    slug: 'discord-nitro',
    name: 'Discord Nitro',
    subtitle: 'Подписка Discord',
    price: 349,
    tag: 'Популярное',
  },
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

      {/* Categories */}
      <section>
        <h3 className="mb-3 text-base font-bold tracking-tight">Категории</h3>
        <div className="grid grid-cols-4 gap-2.5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.slug}
                href={`/mini-app/category/${cat.slug}`}
                className="group flex flex-col items-center gap-2 active:scale-95 transition-transform"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.04] transition-colors group-hover:border-[#e50914]/30 group-hover:bg-[#e50914]/10">
                  <Icon className="h-6 w-6 text-foreground/80 transition-colors group-hover:text-[#ff4d5e]" strokeWidth={1.8} />
                </div>
                <span className="w-full truncate text-center text-[10px] font-medium leading-tight text-muted-foreground">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured */}
      <section>
        <h3 className="mb-3 text-base font-bold tracking-tight">Популярные товары</h3>
        <div className="space-y-2.5">
          {featured.map((p) => (
            <Link
              key={p.slug}
              href={`/mini-app/product/${p.slug}`}
              className="block active:scale-[0.98] transition-transform"
            >
              <div className="flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 transition-colors hover:border-white/[0.12]">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#e50914]/20 to-transparent border border-[#e50914]/20">
                  <Gamepad2 className="h-5 w-5 text-[#ff4d5e]" strokeWidth={1.8} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{p.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{p.subtitle}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-bold">от {p.price} ₽</p>
                  <p className="text-[10px] font-medium text-[#ff4d5e]">{p.tag}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
