import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  // Mock data - will be replaced with API call
  const order = {
    id: params.id,
    product: 'Telegram Stars - 500 Stars',
    status: 'COMPLETED',
    amount: 599,
    currency: 'RUB',
    createdAt: '2024-01-15T10:30:00Z',
    items: [
      {
        name: 'Telegram Stars',
        variant: '500 Stars',
        quantity: 1,
        price: 599,
      },
    ],
    payment: {
      method: 'СБП',
      status: 'PAID',
      amount: 599,
    },
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'COMPLETED':
      case 'PAID':
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
      case 'PAID':
        return 'Оплачено';
      case 'FAILED':
        return 'Ошибка';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/mini-app/orders">
          <Button variant="ghost" size="sm">
            ← Назад
          </Button>
        </Link>
        <h2 className="text-2xl font-bold">Заказ #{order.id}</h2>
      </div>

      {/* Order Status */}
      <Card className="glass neon-glow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Статус заказа</CardTitle>
            <Badge variant={getStatusVariant(order.status) as any}>
              {getStatusText(order.status)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Создан: {new Date(order.createdAt).toLocaleString('ru-RU')}
          </p>
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card className="glass">
        <CardHeader>
          <CardTitle>Товары</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-muted-foreground">{item.variant}</p>
              </div>
              <div className="text-right">
                <p className="font-bold">{item.price} ₽</p>
                <p className="text-sm text-muted-foreground">x{item.quantity}</p>
              </div>
            </div>
          ))}
          <div className="flex justify-between items-center pt-3 border-t border-border/50">
            <span className="font-semibold">Итого:</span>
            <span className="font-bold text-lg">{order.amount} ₽</span>
          </div>
        </CardContent>
      </Card>

      {/* Payment Info */}
      <Card className="glass">
        <CardHeader>
          <CardTitle>Информация об оплате</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Способ оплаты:</span>
            <span>{order.payment.method}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Статус:</span>
            <Badge variant={getStatusVariant(order.payment.status) as any}>
              {getStatusText(order.payment.status)}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Сумма:</span>
            <span className="font-bold">{order.payment.amount} ₽</span>
          </div>
        </CardContent>
      </Card>

      {/* Receipt */}
      <Button variant="outline" className="w-full">
        📄 Скачать чек
      </Button>
    </div>
  );
}
