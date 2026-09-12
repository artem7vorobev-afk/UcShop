import Link from 'next/link';
import { ChevronRight, Package, Star, Gamepad2, Smartphone, Monitor, Gift, Gem } from 'lucide-react';

const categoryData: Record<string, { name: string; description: string; icon: typeof Star }> = {
  'telegram-stars': { name: 'Telegram Stars', description: 'Поддержите любимых авторов', icon: Star },
  'pubg-mobile': { name: 'PUBG Mobile', description: 'UC для PUBG Mobile', icon: Gamepad2 },
  'steam': { name: 'Steam', description: 'Steam Wallet и подарочные карты', icon: Gamepad2 },
  'roblox': { name: 'Roblox', description: 'Robux для Roblox', icon: Gamepad2 },
  'mobile-games': { name: 'Мобильные игры', description: 'Free Fire, Mobile Legends и другие', icon: Smartphone },
  'pc-games': { name: 'PC игры', description: 'Genshin Impact, Valorant, LoL', icon: Monitor },
  'gift-cards': { name: 'Подарочные карты', description: 'PlayStation, Xbox, Nintendo', icon: Gift },
  'subscriptions': { name: 'Подписки', description: 'Discord Nitro и другие подписки', icon: Gem },
};

const mockProducts = [
  { id: '1', name: 'Telegram Stars', slug: 'telegram-stars', price: 59, tag: 'Популярное' },
  { id: '2', name: 'PUBG Mobile UC', slug: 'pubg-mobile-uc', price: 89, tag: 'Хит' },
  { id: '3', name: 'Steam Wallet', slug: 'steam-wallet', price: 100, tag: null },
];

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const category = categoryData[params.slug] || {
    name: 'Категория',
    description: '',
    icon: Package,
  };
  const Icon = category.icon;

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Category Header */}
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#e50914]/25 bg-gradient-to-br from-[#e50914]/20 to-transparent">
          <Icon className="h-7 w-7 text-[#ff4d5e]" strokeWidth={1.8} />
        </div>
        <div className="min-w-0">
          <h2 className="truncate text-xl font-extrabold tracking-tight">{category.name}</h2>
          <p className="truncate text-sm text-muted-foreground">{category.description}</p>
        </div>
      </div>

      {/* Products */}
      {mockProducts.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] py-12 text-center">
          <Package className="h-10 w-10 text-muted-foreground/40" strokeWidth={1.5} />
          <p className="text-sm text-muted-foreground">В этой категории пока нет товаров</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {mockProducts.map((product) => (
            <Link
              key={product.id}
              href={`/mini-app/product/${product.slug}`}
              className="block active:scale-[0.98] transition-transform"
            >
              <div className="group flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 transition-colors hover:border-[#e50914]/25">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold">{product.name}</p>
                    {product.tag && (
                      <span className="shrink-0 rounded-full border border-[#e50914]/30 bg-[#e50914]/15 px-2 py-0.5 text-[10px] font-semibold text-[#ff4d5e]">
                        {product.tag}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">от {product.price} ₽</p>
                </div>
                <div className="flex shrink-0 items-center gap-1 rounded-full bg-gradient-to-r from-[#ff2d42] to-[#e50914] px-4 py-2 text-xs font-bold text-white shadow-[0_4px_16px_rgba(229,9,20,0.35)]">
                  Купить
                  <ChevronRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
