import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AdminDashboardPage() {
  // Mock data - will be replaced with API calls
  const stats = [
    { title: 'Всего заказов', value: '156', change: '+12%' },
    { title: 'Выручка', value: '45 230 ₽', change: '+8%' },
    { title: 'Активных пользователей', value: '1 234', change: '+5%' },
    { title: 'Товаров', value: '45', change: '+2' },
  ];

  const recentOrders = [
    { id: 'ORD-001', product: 'Telegram Stars', amount: 599, status: 'COMPLETED' },
    { id: 'ORD-002', product: 'PUBG Mobile UC', amount: 899, status: 'PROCESSING' },
    { id: 'ORD-003', product: 'Genshin Impact', amount: 1299, status: 'NEW' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dashboard</h2>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="glass">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold">{stat.value}</p>
                <span className="text-sm text-neon-green">{stat.change}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Orders */}
      <Card className="glass">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Последние заказы</CardTitle>
            <Link href="/admin/orders">
              <Button variant="outline" size="sm">
                Все заказы
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                <div>
                  <p className="font-medium">{order.product}</p>
                  <p className="text-sm text-muted-foreground">{order.id}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{order.amount} ₽</p>
                  <p className="text-sm text-muted-foreground">{order.status}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/admin/products">
          <Card className="glass hover:neon-glow transition-all cursor-pointer">
            <CardContent className="p-6 text-center">
              <p className="text-3xl mb-2">📦</p>
              <p className="font-medium">Управление товарами</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/orders">
          <Card className="glass hover:neon-glow transition-all cursor-pointer">
            <CardContent className="p-6 text-center">
              <p className="text-3xl mb-2">📋</p>
              <p className="font-medium">Управление заказами</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/users">
          <Card className="glass hover:neon-glow transition-all cursor-pointer">
            <CardContent className="p-6 text-center">
              <p className="text-3xl mb-2">👥</p>
              <p className="font-medium">Управление пользователями</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
