import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function AdminOrdersPage() {
  // Mock data - will be replaced with API call
  const orders = [
    { id: 'ORD-001', product: 'Telegram Stars - 500 Stars', user: '@testuser', amount: 599, status: 'COMPLETED', createdAt: '2024-01-15T10:30:00Z' },
    { id: 'ORD-002', product: 'PUBG Mobile UC - 660 UC', user: '@user2', amount: 899, status: 'PROCESSING', createdAt: '2024-01-15T09:15:00Z' },
    { id: 'ORD-003', product: 'Genshin Impact - 980 Crystals', user: '@user3', amount: 1299, status: 'NEW', createdAt: '2024-01-15T08:00:00Z' },
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
      case 'NEW':
        return 'Новый';
      case 'FAILED':
        return 'Ошибка';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Заказы</h2>

      <Card className="glass">
        <CardHeader>
          <CardTitle>Все заказы</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order.id} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                <div className="flex-1">
                  <p className="font-medium">{order.product}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.id} • {order.user}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.createdAt).toLocaleString('ru-RU')}
                  </p>
                </div>
                <div className="text-right ml-4">
                  <p className="font-bold">{order.amount} ₽</p>
                  <Badge variant={getStatusVariant(order.status) as any}>
                    {getStatusText(order.status)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
