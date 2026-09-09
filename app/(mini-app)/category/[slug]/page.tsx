import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CategoryPage({ params }: { params: { slug: string } }) {
  // Mock data - will be replaced with API call
  const categoryData: Record<string, { name: string; description: string; icon: string }> = {
    'telegram-stars': { name: 'Telegram Stars', description: 'Поддержите любимых авторов', icon: '⭐' },
    'pubg-mobile': { name: 'PUBG Mobile', description: 'UC для PUBG Mobile', icon: '🎮' },
    'steam': { name: 'Steam', description: 'Steam Wallet и подарочные карты', icon: '🎮' },
    'roblox': { name: 'Roblox', description: 'Robux для Roblox', icon: '🎮' },
    'mobile-games': { name: 'Мобильные игры', description: 'Free Fire, Mobile Legends и другие', icon: '📱' },
    'pc-games': { name: 'PC игры', description: 'Genshin Impact, Valorant, LoL', icon: '💻' },
    'gift-cards': { name: 'Подарочные карты', description: 'PlayStation, Xbox, Nintendo', icon: '🎁' },
    'subscriptions': { name: 'Подписки', description: 'Discord Nitro и другие подписки', icon: '💎' },
  };

  const category = categoryData[params.slug] || { name: 'Категория', description: '', icon: '📦' };

  const mockProducts = [
    { id: '1', name: 'Telegram Stars', slug: 'telegram-stars', price: 59, isFeatured: true },
    { id: '2', name: 'PUBG Mobile UC', slug: 'pubg-mobile-uc', price: 89, isFeatured: true },
    { id: '3', name: 'Steam Wallet', slug: 'steam-wallet', price: 100, isFeatured: true },
  ];

  return (
    <div className="space-y-6">
      {/* Category Header */}
      <div className="flex items-center gap-3">
        <span className="text-4xl">{category.icon}</span>
        <div>
          <h2 className="text-2xl font-bold">{category.name}</h2>
          <p className="text-muted-foreground text-sm">{category.description}</p>
        </div>
      </div>

      {/* Products */}
      <div className="space-y-3">
        {mockProducts.map((product) => (
          <Link key={product.id} href={`/mini-app/product/${product.slug}`}>
            <Card className="glass hover:neon-glow transition-all cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base">{product.name}</CardTitle>
                  {product.isFeatured && <Badge variant="neon">Популярное</Badge>}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">от {product.price} ₽</p>
                  <Button variant="neon" size="sm">
                    Купить
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
