import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gradient mb-2">UcShop1</h1>
        <p className="text-muted-foreground">Магазин цифровых товаров и игровых пополнений</p>
      </div>

      {/* Mini App Link */}
      <div className="mb-8">
        <Card className="glass neon-glow">
          <CardHeader>
            <CardTitle className="text-2xl">Telegram Mini App</CardTitle>
            <CardDescription>Откройте магазин прямо в Telegram</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/mini-app">
              <Button variant="neon" className="w-full">
                Открыть Mini App
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Admin Link */}
      <div className="mb-8">
        <Card className="glass">
          <CardHeader>
            <CardTitle>Админ-панель</CardTitle>
            <CardDescription>Управление магазином</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin">
              <Button variant="outline" className="w-full">
                Войти в админку
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-lg">Быстрая доставка</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Автоматическая выдача товаров после оплаты</p>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-lg">Безопасно</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Оплата через СБП и другие безопасные методы</p>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-lg">Бонусы</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Реферальная программа и промокоды</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
