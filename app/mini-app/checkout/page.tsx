'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUserStore } from '@/store/user';
import { QrCode, Tag, User, ShieldCheck } from 'lucide-react';

export default function CheckoutPage() {
  const { user } = useUserStore();

  return (
    <div className="space-y-5 animate-fade-up">
      <h2 className="text-xl font-extrabold tracking-tight">Оформление заказа</h2>

      {/* Order Summary */}
      <div className="rounded-2xl border border-[#e50914]/25 bg-gradient-to-br from-[#1a0507] to-background p-5 glow-red-sm">
        <h3 className="mb-3 text-sm font-bold tracking-tight">Ваш заказ</h3>
        <div className="space-y-2.5">
          <div className="flex items-center justify-between gap-3">
            <span className="truncate text-sm">Telegram Stars — 500 Stars</span>
            <span className="shrink-0 text-sm font-bold">599 ₽</span>
          </div>
          <div className="flex items-center justify-between border-t border-white/[0.08] pt-3">
            <span className="text-sm font-semibold">Итого:</span>
            <span className="text-lg font-extrabold text-[#ff4d5e]">599 ₽</span>
          </div>
        </div>
      </div>

      {/* Promo Code */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-[#ff4d5e]" />
          <h3 className="text-sm font-bold tracking-tight">Промокод</h3>
        </div>
        <div className="flex gap-2">
          <Input placeholder="Введите промокод" className="flex-1" />
          <Button variant="outline" className="shrink-0">Применить</Button>
        </div>
      </div>

      {/* Contact Info */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 space-y-3">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-[#ff4d5e]" />
          <h3 className="text-sm font-bold tracking-tight">Контактные данные</h3>
        </div>
        <div className="space-y-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Telegram username</label>
            <Input
              placeholder="@username"
              defaultValue={user?.telegramUsername ? `@${user.telegramUsername}` : ''}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Telegram User ID</label>
            <Input
              placeholder="123456789"
              inputMode="numeric"
              defaultValue={user?.telegramId || ''}
            />
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 space-y-3">
        <h3 className="text-sm font-bold tracking-tight">Способ оплаты</h3>
        <label
          htmlFor="sbp"
          className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#e50914]/30 bg-[#e50914]/10 p-4 transition-colors"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e50914]/15">
            <QrCode className="h-5 w-5 text-[#ff4d5e]" strokeWidth={1.8} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">СБП — Система быстрых платежей</p>
            <p className="text-xs text-muted-foreground">Оплата через QR-код</p>
          </div>
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-[#e50914]">
            <div className="h-2.5 w-2.5 rounded-full bg-[#e50914]" />
          </div>
        </label>
      </div>

      {/* Submit */}
      <Button variant="neon" className="w-full" size="lg">
        Оплатить 599 ₽
      </Button>

      <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
        <ShieldCheck className="h-3.5 w-3.5" />
        Нажимая кнопку, вы соглашаетесь с условиями использования
      </div>
    </div>
  );
}
