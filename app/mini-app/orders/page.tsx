import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Receipt, ChevronRight, CheckCircle2, Loader2, XCircle } from 'lucide-react';

const mockOrders = [
  {
    id: 'ORD-001',
    product: 'Telegram Stars — 500 Stars',
    status: 'COMPLETED',
    amount: 599,
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 'ORD-002',
    product: 'PUBG Mobile UC — 660 UC',
    status: 'PROCESSING',
    amount: 899,
    createdAt: '2024-01-14T15:45:00Z',
  },
];

const statusConfig: Record<string, { text: string; className: string; icon: typeof CheckCircle2 }> = {
  COMPLETED: {
    text: 'Выполнен',
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
  icon: Receipt,
};

export default function OrdersPage() {
  return (
    <div className="space-y-5 animate-fade-up">
      <h2 className="text-xl font-extrabold tracking-tight">Мои заказы</h2>

      {mockOrders.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.03] py-14 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.04]">
            <Receipt className="h-8 w-8 text-muted-foreground/40" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-sm font-semibold">У вас пока нет заказов</p>
            <p className="mt-1 text-xs text-muted-foreground">Оформите первый заказ в каталоге</p>
          </div>
          <Link href="/mini-app/categories">
            <Button variant="neon" size="sm">Перейти в каталог</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-2.5">
          {mockOrders.map((order) => {
            const status = statusConfig[order.status] || defaultStatus;
            const StatusIcon = status.icon;
            return (
              <Link
                key={order.id}
                href={`/mini-app/orders/${order.id}`}
                className="block active:scale-[0.98] transition-transform"
              >
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 transition-colors hover:border-white/[0.12]">
                  <div className="flex items-start justify-between gap-3">
                    <p className="min-w-0 flex-1 truncate text-sm font-semibold">{order.product}</p>
                    <span className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${status.className}`}>
                      <StatusIcon className="h-3 w-3" />
                      {status.text}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString('ru-RU')} · #{order.id}
                    </span>
                    <span className="flex items-center gap-1 text-sm font-bold">
                      {order.amount} ₽
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
