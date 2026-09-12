import { Metadata } from 'next';
import { TelegramAuth } from '@/components/telegram/TelegramAuth';

export const metadata: Metadata = {
  title: 'UcShop1 Mini App',
  description: 'Магазин цифровых товаров в Telegram',
};

export default function MiniAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background">
      <TelegramAuth />
      {/* Mini App Header */}
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gradient">UcShop1</h1>
            <nav className="flex gap-2">
              <a href="/mini-app" className="text-sm text-muted-foreground hover:text-foreground">
                Главная
              </a>
              <a href="/mini-app/orders" className="text-sm text-muted-foreground hover:text-foreground">
                Заказы
              </a>
              <a href="/mini-app/profile" className="text-sm text-muted-foreground hover:text-foreground">
                Профиль
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-6">{children}</main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 glass border-t border-border/50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-around">
            <a href="/mini-app" className="flex flex-col items-center text-sm">
              <span className="text-2xl mb-1">🏠</span>
              <span className="text-muted-foreground">Главная</span>
            </a>
            <a href="/mini-app/categories" className="flex flex-col items-center text-sm">
              <span className="text-2xl mb-1">📦</span>
              <span className="text-muted-foreground">Каталог</span>
            </a>
            <a href="/mini-app/orders" className="flex flex-col items-center text-sm">
              <span className="text-2xl mb-1">📋</span>
              <span className="text-muted-foreground">Заказы</span>
            </a>
            <a href="/mini-app/profile" className="flex flex-col items-center text-sm">
              <span className="text-2xl mb-1">👤</span>
              <span className="text-muted-foreground">Профиль</span>
            </a>
          </div>
        </div>
      </nav>

      {/* Spacer for bottom nav */}
      <div className="h-20" />
    </div>
  );
}
