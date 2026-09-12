'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useUserStore } from '@/store/user';

export default function CheckoutPage() {
  const { user } = useUserStore();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Оформление заказа</h2>

      {/* Order Summary */}
      <Card className="glass neon-glow">
        <CardHeader>
          <CardTitle>Ваш заказ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span>Telegram Stars - 500 Stars</span>
            <span className="font-bold">599 ₽</span>
          </div>
          <div className="border-t border-border/50 pt-3 flex justify-between">
            <span className="font-semibold">Итого:</span>
            <span className="font-bold text-lg">599 ₽</span>
          </div>
        </CardContent>
      </Card>

      {/* Promo Code */}
      <Card className="glass">
        <CardHeader>
          <CardTitle>Промокод</CardTitle>
          <CardDescription>Введите промокод для скидки</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input placeholder="Введите промокод" />
            <Button variant="outline">Применить</Button>
          </div>
        </CardContent>
      </Card>

      {/* Contact Info */}
      <Card className="glass">
        <CardHeader>
          <CardTitle>Контактные данные</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Telegram username</label>
            <Input
              placeholder="@username"
              defaultValue={user?.telegramUsername ? `@${user.telegramUsername}` : ''}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Telegram User ID</label>
            <Input
              placeholder="123456789"
              defaultValue={user?.telegramId || ''}
            />
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card className="glass">
        <CardHeader>
          <CardTitle>Способ оплаты</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3 p-3 border border-neon-blue/30 rounded-md bg-neon-blue/10">
            <input type="radio" name="payment" id="sbp" className="accent-neon-blue" />
            <label htmlFor="sbp" className="flex-1 cursor-pointer">
              <p className="font-medium">СБП (Система быстрых платежей)</p>
              <p className="text-sm text-muted-foreground">Оплата через QR-код</p>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Submit */}
      <Button variant="neon" className="w-full" size="lg">
        Оплатить 599 ₽
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        Нажимая кнопку, вы соглашаетесь с условиями использования
      </p>
    </div>
  );
}
