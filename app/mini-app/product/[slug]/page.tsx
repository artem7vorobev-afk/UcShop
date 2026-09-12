import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Package, Star, Gamepad2, Zap, ShieldCheck, Clock } from 'lucide-react';

const productData: Record<string, {
  name: string;
  description: string;
  icon: typeof Star;
  variants: { id: string; name: string; price: number }[];
}> = {
  'telegram-stars': {
    name: 'Telegram Stars',
    description: 'Поддержите любимых авторов в Telegram',
    icon: Star,
    variants: [
      { id: '1', name: '50 Stars', price: 59 },
      { id: '2', name: '100 Stars', price: 119 },
      { id: '3', name: '250 Stars', price: 299 },
      { id: '4', name: '500 Stars', price: 599 },
      { id: '5', name: '1000 Stars', price: 1199 },
    ],
  },
  'pubg-mobile-uc': {
    name: 'PUBG Mobile UC',
    description: 'Unknown Cash для PUBG Mobile',
    icon: Gamepad2,
    variants: [
      { id: '1', name: '60 UC', price: 89 },
      { id: '2', name: '325 UC', price: 449 },
      { id: '3', name: '660 UC', price: 899 },
      { id: '4', name: '1800 UC', price: 2399 },
      { id: '5', name: '3850 UC', price: 4999 },
    ],
  },
};

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = productData[params.slug] || {
    name: 'Товар',
    description: 'Описание товара',
    icon: Package,
    variants: [],
  };
  const Icon = product.icon;

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Product Header */}
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-[#e50914]/25 bg-gradient-to-br from-[#e50914]/20 to-transparent glow-red-sm">
          <Icon className="h-8 w-8 text-[#ff4d5e]" strokeWidth={1.8} />
        </div>
        <div className="min-w-0">
          <h2 className="truncate text-xl font-extrabold tracking-tight">{product.name}</h2>
          <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
        </div>
      </div>

      {/* Trust badges */}
      <div className="flex gap-2">
        <div className="flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-[11px] text-muted-foreground">
          <Zap className="h-3 w-3 text-[#ff4d5e]" />
          Мгновенная выдача
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-[11px] text-muted-foreground">
          <ShieldCheck className="h-3 w-3 text-[#ff4d5e]" />
          Гарантия
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-[11px] text-muted-foreground">
          <Clock className="h-3 w-3 text-[#ff4d5e]" />
          24/7
        </div>
      </div>

      {/* Variants */}
      <div className="space-y-2.5">
        <h3 className="text-base font-bold tracking-tight">Выберите номинал</h3>
        {product.variants.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] py-10 text-center">
            <Package className="h-10 w-10 text-muted-foreground/40" strokeWidth={1.5} />
            <p className="text-sm text-muted-foreground">Варианты скоро появятся</p>
          </div>
        ) : (
          product.variants.map((variant) => (
            <div
              key={variant.id}
              className="group flex items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 transition-colors hover:border-[#e50914]/25 active:scale-[0.98]"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{variant.name}</p>
                <p className="text-base font-extrabold text-[#ff4d5e]">{variant.price} ₽</p>
              </div>
              <Link href="/mini-app/checkout">
                <Button variant="neon" size="sm">
                  Выбрать
                </Button>
              </Link>
            </div>
          ))
        )}
      </div>

      {/* Order Form */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 space-y-4">
        <div>
          <h3 className="text-base font-bold tracking-tight">Оформление заказа</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Заполните данные для получения товара</p>
        </div>
        <div className="space-y-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Telegram username</label>
            <Input placeholder="@username" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Telegram User ID</label>
            <Input placeholder="123456789" inputMode="numeric" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Email (опционально)</label>
            <Input type="email" placeholder="email@example.com" inputMode="email" />
          </div>
        </div>
        <Link href="/mini-app/checkout" className="block">
          <Button variant="neon" className="w-full" size="lg">
            Перейти к оплате
          </Button>
        </Link>
      </div>
    </div>
  );
}
