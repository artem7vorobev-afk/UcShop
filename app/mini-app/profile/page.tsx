import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ProfilePage() {
  // Mock data - will be replaced with API call
  const user = {
    telegramUsername: '@testuser',
    firstName: 'Test',
    lastName: 'User',
    balance: 0,
    referralCode: 'TESTREF',
    referralEarnings: 150,
    referralCount: 3,
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Профиль</h2>

      {/* User Info */}
      <Card className="glass neon-glow">
        <CardHeader>
          <CardTitle>Информация о пользователе</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center text-2xl">
              👤
            </div>
            <div>
              <p className="font-semibold">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-sm text-muted-foreground">{user.telegramUsername}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Balance */}
      <Card className="glass">
        <CardHeader>
          <CardTitle>Баланс</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-gradient">{user.balance} ₽</p>
          <p className="text-sm text-muted-foreground mt-1">Доступно для вывода</p>
        </CardContent>
      </Card>

      {/* Referral Program */}
      <Card className="glass neon-glow-purple">
        <CardHeader>
          <CardTitle>Реферальная программа</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-2xl font-bold">{user.referralCount}</p>
              <p className="text-sm text-muted-foreground">Приглашённых</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{user.referralEarnings} ₽</p>
              <p className="text-sm text-muted-foreground">Заработано</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Ваш реферальный код:</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={user.referralCode}
                readOnly
                className="flex-1 px-3 py-2 bg-background/50 border border-border/50 rounded-md text-sm"
              />
              <Button variant="outline" size="sm">
                Копировать
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Зарабатывайте 0.5% от каждого заказа приглашённых пользователей
          </p>
        </CardContent>
      </Card>

      {/* Menu */}
      <div className="space-y-3">
        <Link href="/mini-app/orders">
          <Card className="glass hover:neon-glow transition-all cursor-pointer">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📋</span>
                <span>История заказов</span>
              </div>
              <span>→</span>
            </CardContent>
          </Card>
        </Link>
        <Link href="/mini-app/faq">
          <Card className="glass hover:neon-glow transition-all cursor-pointer">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">❓</span>
                <span>FAQ</span>
              </div>
              <span>→</span>
            </CardContent>
          </Card>
        </Link>
        <Link href="/mini-app/support">
          <Card className="glass hover:neon-glow transition-all cursor-pointer">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">💬</span>
                <span>Поддержка</span>
              </div>
              <span>→</span>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
