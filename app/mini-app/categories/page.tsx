import Link from 'next/link';
import { Star, Gamepad2, Smartphone, Monitor, Gift, Gem, ChevronRight } from 'lucide-react';

const categories = [
  { slug: 'telegram-stars', name: 'Telegram Stars', desc: 'Валюта Telegram', icon: Star },
  { slug: 'pubg-mobile', name: 'PUBG Mobile', desc: 'UC и наборы', icon: Gamepad2 },
  { slug: 'steam', name: 'Steam', desc: 'Wallet и карты', icon: Gamepad2 },
  { slug: 'roblox', name: 'Roblox', desc: 'Robux', icon: Gamepad2 },
  { slug: 'mobile-games', name: 'Мобильные игры', desc: 'Free Fire, ML и др.', icon: Smartphone },
  { slug: 'pc-games', name: 'PC игры', desc: 'Genshin, Valorant, LoL', icon: Monitor },
  { slug: 'gift-cards', name: 'Подарочные карты', desc: 'PS, Xbox, Nintendo', icon: Gift },
  { slug: 'subscriptions', name: 'Подписки', desc: 'Discord Nitro и др.', icon: Gem },
];

export default function CategoriesPage() {
  return (
    <div className="space-y-5 animate-fade-up">
      <h2 className="text-xl font-extrabold tracking-tight">Каталог</h2>
      <div className="space-y-2.5">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link
              key={cat.slug}
              href={`/mini-app/category/${cat.slug}`}
              className="block active:scale-[0.98] transition-transform"
            >
              <div className="group flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 transition-colors hover:border-[#e50914]/25">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.04] transition-colors group-hover:border-[#e50914]/30 group-hover:bg-[#e50914]/10">
                  <Icon className="h-5 w-5 text-foreground/80 transition-colors group-hover:text-[#ff4d5e]" strokeWidth={1.8} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{cat.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{cat.desc}</p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/50" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
