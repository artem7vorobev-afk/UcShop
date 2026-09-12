'use client';

import { useUserStore } from '@/store/user';
import { Users, Gift, Copy, Share2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

interface ReferralItem {
  id: string;
  status: string;
  createdAt: string;
  earned: number;
  referredUser: {
    firstName?: string;
    lastName?: string;
    telegramUsername?: string;
  };
}

interface ReferralStats {
  totalReferrals: number;
  activeReferrals: number;
  totalEarned: number;
  availableBalance: number;
}

export default function ReferralsPage() {
  const { user, isLoading } = useUserStore();
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [referrals, setReferrals] = useState<ReferralItem[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    fetch(`/api/referral/${user.id}/stats`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setStats(d))
      .catch(() => {});
    fetch(`/api/referral/${user.id}/referrals`)
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => Array.isArray(d) && setReferrals(d))
      .catch(() => {});
  }, [user?.id]);

  const botUsername = process.env.NEXT_PUBLIC_BOT_USERNAME || 'UC_Steam_Bot';
  const referralLink = `https://t.me/${botUsername}?start=ref_${user?.referralCode || ''}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  const shareLink = () => {
    const text = 'Заходи в UcShop — магазин цифровых товаров и игровых пополнений!';
    const url = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(text)}`;
    const tg = (window as any).Telegram?.WebApp;
    if (tg?.openTelegramLink) {
      tg.openTelegramLink(url);
    } else {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="space-y-5 animate-fade-up">
      <h2 className="text-xl font-extrabold tracking-tight">Мои рефералы</h2>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-3.5 text-center">
          <p className="text-xl font-extrabold">{stats?.totalReferrals ?? 0}</p>
          <p className="text-[10px] text-muted-foreground">Приглашено</p>
        </div>
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-3.5 text-center">
          <p className="text-xl font-extrabold">{stats?.activeReferrals ?? 0}</p>
          <p className="text-[10px] text-muted-foreground">Активных</p>
        </div>
        <div className="rounded-2xl border border-[#e50914]/25 bg-gradient-to-br from-[#1a0507] to-background p-3.5 text-center glow-red-sm">
          <p className="text-xl font-extrabold text-gradient-red">{stats?.totalEarned ?? 0} ₽</p>
          <p className="text-[10px] text-muted-foreground">Заработано</p>
        </div>
      </div>

      {/* Referral link */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 space-y-3">
        <p className="text-xs font-medium text-muted-foreground">Ваша реферальная ссылка:</p>
        <div className="flex gap-2">
          <div className="flex h-11 min-w-0 flex-1 items-center truncate rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 font-mono text-xs">
            {referralLink}
          </div>
          <Button variant="outline" size="sm" className="h-11 shrink-0" onClick={copyLink}>
            <Copy className="h-3.5 w-3.5" />
            {copied ? 'Ок' : ''}
          </Button>
          <Button variant="neon" size="sm" className="h-11 shrink-0" onClick={shareLink}>
            <Share2 className="h-3.5 w-3.5" />
          </Button>
        </div>
        <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Gift className="h-3 w-3 text-[#ff4d5e]" />
          0.5% от каждого заказа приглашённых пользователей
        </p>
      </div>

      {/* Referrals list */}
      <div className="space-y-2.5">
        <h3 className="text-sm font-bold tracking-tight">Список рефералов</h3>
        {isLoading ? (
          <div className="space-y-2.5">
            {[1, 2].map((i) => (
              <div key={i} className="shimmer h-16 rounded-2xl" />
            ))}
          </div>
        ) : referrals.length === 0 ? (
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 text-center">
            <Users className="mx-auto mb-2 h-8 w-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">Пока нет рефералов</p>
            <p className="mt-1 text-xs text-muted-foreground/60">
              Поделитесь ссылкой, чтобы получать 0.5% с заказов
            </p>
          </div>
        ) : (
          referrals.map((r) => {
            const u = r.referredUser;
            const name =
              [u?.firstName, u?.lastName].filter(Boolean).join(' ') ||
              (u?.telegramUsername ? `@${u.telegramUsername}` : 'Пользователь');
            const date = new Date(r.createdAt).toLocaleDateString('ru-RU', {
              day: 'numeric',
              month: 'short',
            });
            return (
              <div
                key={r.id}
                className="flex items-center gap-3.5 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#ff2d42]/30 to-[#e50914]/10 border border-[#e50914]/20 text-sm font-bold text-[#ff4d5e]">
                  {(u?.firstName?.[0] || u?.telegramUsername?.[0] || '?').toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{name}</p>
                  <p className="truncate text-[11px] text-muted-foreground">
                    {u?.telegramUsername ? `@${u.telegramUsername} · ` : ''}
                    {date}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-bold text-emerald-400">+{r.earned} ₽</p>
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      r.status === 'ACTIVE'
                        ? 'bg-emerald-500/15 text-emerald-400'
                        : r.status === 'COMPLETED'
                          ? 'bg-[#e50914]/15 text-[#ff4d5e]'
                          : 'bg-white/[0.06] text-muted-foreground'
                    }`}
                  >
                    {r.status === 'ACTIVE' ? 'Активен' : r.status === 'COMPLETED' ? 'Оплатил' : r.status}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
