import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronLeft, CheckCircle2, Loader2, XCircle, FileText, QrCode } from 'lucide-react';

const statusConfig: Record<string, { text: string; className: string; icon: typeof CheckCircle2 }> = {
  COMPLETED: {
    text: 'Выполнен',
    className: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
    icon: CheckCircle2,
  },
  PAID: {
    text: 'Оплачено',
    className: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
    icon: CheckCircle2,
  },
  PROCESSING: {
    text: 'В обработке',
    className: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
    icon: Loader2,
  },
  FAILED: {
    text: 'Ошибка',
    className: 'border-red-500/30 bg-red-500/10 text-red-400',
    icon: XCircle,
  },
};

const defaultStatus = {
  text: 'Новый',
  className: 'border-white/10 bg-white/[0.06] text-muted-foreground',
  icon: CheckCircle2,
};

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const order = {
    id: params.id,
    status: 'COMPLETED',
    amount: 599,
    createdAt: '2024-01-15T10:30:00Z',
    items: [
      { name: 'Telegram Stars', variant: '500 Stars', quantity: 1, price: 599 },
    ],
    payment: { method: 'СБП', status: 'PAID', amount: 599 },
  };

  const status = statusConfig[order.status] || defaultStatus;
  const payStatus = statusConfig[order.payment.status] || defaultStatus;
  const StatusIcon = status.icon;
  const PayIcon = payStatus.icon;

  return (
    <div className="space-y-5 animate-fade-up">
      <div className="flex items-center gap-3">
        <Link
          href="/mini-app/orders"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] active:scale-95 transition-transform"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
        <h2 className="min-w-0 truncate text-xl font-extrabold tracking-tight">Заказ #{order.id}</h2>
      </div>

      {/* Status */}
      <div className="rounded-2xl border border-[#e50914]/25 bg-gradient-to-br from-[#1a0507] to-background p-5 glow-red-sm">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-bold tracking-tight">Статус заказа</h3>
          <span className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${status.className}`}>
            <StatusIcon className="h-3 w-3" />
            {status.text}
          </span>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Создан: {new Date(order.createdAt).toLocaleString('ru-RU')}
        </p>
      </div>

      {/* Items */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5">
        <h3 className="mb-3 text-sm font-bold tracking-tight">Товары</h3>
        <div className="space-y-3">
          {order.items.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-3 border-b border-white/[0.06] pb-3 last:border-0 last:pb-0"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.variant}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-sm font-bold">{item.price} ₽</p>
                <p className="text-xs text-muted-foreground">×{item.quantity}</p>
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between border-t border-white/[0.08] pt-3">
            <span className="text-sm font-semibold">Итого:</span>
            <span className="text-lg font-extrabold text-[#ff4d5e]">{order.amount} ₽</span>
          </div>
        </div>
      </div>

      {/* Payment */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5">
        <h3 className="mb-3 text-sm font-bold tracking-tight">Информация об оплате</h3>
        <div className="space-y-2.5 text-sm">
          <div className="flex items-center justify-between gap-3">
            <span className="text-muted-foreground">Способ оплаты:</span>
            <span className="flex items-center gap-1.5 font-medium">
              <QrCode className="h-3.5 w-3.5 text-[#ff4d5e]" />
              {order.payment.method}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-muted-foreground">Статус:</span>
            <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${payStatus.className}`}>
              <PayIcon className="h-3 w-3" />
              {payStatus.text}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-muted-foreground">Сумма:</span>
            <span className="font-bold">{order.payment.amount} ₽</span>
          </div>
        </div>
      </div>

      <Button variant="outline" className="w-full">
        <FileText className="h-4 w-4" />
        Скачать чек
      </Button>
    </div>
  );
}
