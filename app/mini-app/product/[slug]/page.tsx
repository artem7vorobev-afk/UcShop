import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function ProductPage({ params }: { params: { slug: string } }) {
  // Mock data - will be replaced with API call
  const productData: Record<string, {
    name: string;
    description: string;
    icon: string;
    variants: { id: string; name: string; price: number }[];
  }> = {
    'telegram-stars': {
      name: 'Telegram Stars',
      description: 'Поддержите любимых авторов в Telegram',
      icon: '⭐',
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
      description: 'Неизвестные Cash для PUBG Mobile',
      icon: '🎮',
      variants: [
        { id: '1', name: '60 UC', price: 89 },
        { id: '2', name: '325 UC', price: 449 },
        { id: '3', name: '660 UC', price: 899 },
        { id: '4', name: '1800 UC', price: 2399 },
        { id: '5', name: '3850 UC', price: 4999 },
      ],
    },
  };

  const product = productData[params.slug] || {
    name: 'Товар',
    description: 'Описание товара',
    icon: '📦',
    variants: [],
  };

  return (
    <div className="space-y-6">
      {/* Product Header */}
      <div className="flex items-center gap-3">
        <span className="text-4xl">{product.icon}</span>
        <div>
          <h2 className="text-2xl font-bold">{product.name}</h2>
          <p className="text-muted-foreground text-sm">{product.description}</p>
        </div>
      </div>

      {/* Variants */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Выберите номинал</h3>
        {product.variants.map((variant) => (
          <Card key={variant.id} className="glass hover:neon-glow transition-all cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{variant.name}</p>
                  <p className="text-lg font-bold text-neon-blue">{variant.price} ₽</p>
                </div>
                <Button variant="neon" size="sm">
                  Выбрать
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Order Form */}
      <Card className="glass">
        <CardHeader>
          <CardTitle>Оформление заказа</CardTitle>
          <CardDescription>Заполните данные для получения товара</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Telegram username</label>
            <Input placeholder="@username" />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Telegram User ID</label>
            <Input placeholder="123456789" />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Email (опционально)</label>
            <Input type="email" placeholder="email@example.com" />
          </div>
          <Link href="/mini-app/checkout">
            <Button variant="neon" className="w-full">
              Перейти к оплате
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
