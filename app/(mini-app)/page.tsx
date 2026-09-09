import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function MiniAppHomePage() {
  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Добро пожаловать!</h2>
        <p className="text-muted-foreground">Выберите категорию или воспользуйтесь поиском</p>
      </div>

      {/* Telegram Stars Banner */}
      <Card className="glass neon-glow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                ⭐ Telegram Stars
              </CardTitle>
              <CardDescription className="mt-2">
                Поддержите любимых авторов в Telegram
              </CardDescription>
            </div>
            <Badge variant="neon" className="animate-pulse">
              Популярное
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Link href="/mini-app/product/telegram-stars">
            <Button variant="neon" className="w-full">
              Купить Stars
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Categories */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Категории</h3>
        <div className="grid grid-cols-2 gap-3">
          <Link href="/mini-app/category/telegram-stars">
            <Card className="glass hover:neon-glow transition-all cursor-pointer">
              <CardContent className="p-4 text-center">
                <span className="text-3xl mb-2 block">⭐</span>
                <span className="text-sm font-medium">Telegram Stars</span>
              </CardContent>
            </Card>
          </Link>
          <Link href="/mini-app/category/pubg-mobile">
            <Card className="glass hover:neon-glow transition-all cursor-pointer">
              <CardContent className="p-4 text-center">
                <span className="text-3xl mb-2 block">🎮</span>
                <span className="text-sm font-medium">PUBG Mobile</span>
              </CardContent>
            </Card>
          </Link>
          <Link href="/mini-app/category/steam">
            <Card className="glass hover:neon-glow transition-all cursor-pointer">
              <CardContent className="p-4 text-center">
                <span className="text-3xl mb-2 block">🎮</span>
                <span className="text-sm font-medium">Steam</span>
              </CardContent>
            </Card>
          </Link>
          <Link href="/mini-app/category/roblox">
            <Card className="glass hover:neon-glow transition-all cursor-pointer">
              <CardContent className="p-4 text-center">
                <span className="text-3xl mb-2 block">🎮</span>
                <span className="text-sm font-medium">Roblox</span>
              </CardContent>
            </Card>
          </Link>
          <Link href="/mini-app/category/mobile-games">
            <Card className="glass hover:neon-glow transition-all cursor-pointer">
              <CardContent className="p-4 text-center">
                <span className="text-3xl mb-2 block">📱</span>
                <span className="text-sm font-medium">Мобильные игры</span>
              </CardContent>
            </Card>
          </Link>
          <Link href="/mini-app/category/pc-games">
            <Card className="glass hover:neon-glow transition-all cursor-pointer">
              <CardContent className="p-4 text-center">
                <span className="text-3xl mb-2 block">💻</span>
                <span className="text-sm font-medium">PC игры</span>
              </CardContent>
            </Card>
          </Link>
          <Link href="/mini-app/category/gift-cards">
            <Card className="glass hover:neon-glow transition-all cursor-pointer">
              <CardContent className="p-4 text-center">
                <span className="text-3xl mb-2 block">🎁</span>
                <span className="text-sm font-medium">Подарочные карты</span>
              </CardContent>
            </Card>
          </Link>
          <Link href="/mini-app/category/subscriptions">
            <Card className="glass hover:neon-glow transition-all cursor-pointer">
              <CardContent className="p-4 text-center">
                <span className="text-3xl mb-2 block">💎</span>
                <span className="text-sm font-medium">Подписки</span>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Featured Products */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Популярные товары</h3>
        <div className="space-y-3">
          <Link href="/mini-app/product/genshin-impact-crystals">
            <Card className="glass hover:neon-glow-purple transition-all cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Genshin Impact</CardTitle>
                  <Badge variant="neonPurple">Хит</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground">Кристаллы Genesis</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/mini-app/product/discord-nitro">
            <Card className="glass hover:neon-glow transition-all cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Discord Nitro</CardTitle>
                  <Badge variant="neon">Популярное</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground">Подписка Discord</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
