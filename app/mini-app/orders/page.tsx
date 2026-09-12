import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function OrdersPage() {
  // Mock data - will be replaced with API call
  const mockOrders = [
    {
      id: 'ORD-001',
      product: 'Telegram Stars - 500 Stars',
      status: 'COMPLETED',
      amount: 599,
      createdAt: '2024-01-15T10:30:00Z',
    },
    {
      id: 'ORD-002',
      product: 'PUBG Mobile UC - 660 UC',
      status: 'PROCESSING',
      amount: 899,
      createdAt: '2024-01-14T15:45:00Z',
    },
  ];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'neon';
      case 'PROCESSING':
        return 'neonPurple';
      case 'FAILED':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'Выполнен';
      case 'PROCESSING':
        return 'В обработке';
      case 'FAILED':
        return 'Ошибка';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Мои заказы</h2>

      {mockOrders.length === 0 ? (
        <Card className="glass">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">У вас пока нет заказов</p>
            <Link href="/mini-app">
              <Button variant="neon" className="mt-4">
                Перейти в каталог
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {mockOrders.map((order) => (
            <Link key={order.id} href={`/mini-app/orders/${order.id}`}>
              <Card className="glass hover:neon-glow transition-all cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base">{order.product}</CardTitle>
                    <Badge variant={getStatusVariant(order.status) as any}>
                      {getStatusText(order.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                    </span>
                    <span className="font-bold">{order.amount} ₽</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
