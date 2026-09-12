import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

export default function CategoriesPage() {
  const categories = [
    { slug: 'telegram-stars', name: 'Telegram Stars', icon: '⭐' },
    { slug: 'pubg-mobile', name: 'PUBG Mobile', icon: '🎮' },
    { slug: 'steam', name: 'Steam', icon: '🎮' },
    { slug: 'roblox', name: 'Roblox', icon: '🎮' },
    { slug: 'mobile-games', name: 'Мобильные игры', icon: '📱' },
    { slug: 'pc-games', name: 'PC игры', icon: '💻' },
    { slug: 'gift-cards', name: 'Подарочные карты', icon: '🎁' },
    { slug: 'subscriptions', name: 'Подписки', icon: '💎' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Каталог</h2>
      <div className="grid grid-cols-2 gap-3">
        {categories.map((category) => (
          <Link key={category.slug} href={`/mini-app/category/${category.slug}`}>
            <Card className="glass hover:neon-glow transition-all cursor-pointer">
              <CardContent className="p-6 text-center">
                <span className="text-4xl mb-3 block">{category.icon}</span>
                <span className="text-sm font-medium">{category.name}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
