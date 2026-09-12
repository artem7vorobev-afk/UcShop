'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useUserStore } from '@/store/user';
import {
  Receipt,
  HelpCircle,
  MessageCircle,
  ChevronRight,
  Copy,
  Share2,
  Wallet,
  Users,
  Gift,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface ReferralItem {
  id: string;
  status: string;
  createdAt: string;
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

const menuItems = [
  { href: '/mini-app/orders', label: 'История заказов', icon: Receipt },
  { href: '/mini-app/faq', label: 'FAQ', icon: HelpCircle },
  { href: '/mini-app/support', label: 'Поддержка', icon: MessageCircle },
];

export default function ProfilePage() {
  const { user, isLoading, debug } = useUserStore();
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [referrals, setReferrals] = useState<ReferralItem[]>([]);

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

  const displayUser = {
    telegramUsername: user?.telegramUsername ? `@${user.telegramUsername}` : '—',
    firstName: user?.firstName || 'Гость',
    lastName: user?.lastName || '',
    balance: stats?.availableBalance ?? 0,
    referralCode: user?.referralCode || '—',
    referralEarnings: stats?.totalEarned ?? 0,
    referralCount: stats?.totalReferrals ?? 0,
  };

  const botUsername = process.env.NEXT_PUBLIC_BOT_USERNAME || 'UC_Steam_Bot';
  const referralLink = `https://t.me/${botUsername}?start=ref_${displayUser.referralCode}`;

  const initials = (displayUser.firstName[0] || 'Г').toUpperCase();

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
      <h2 className="text-xl font-extrabold tracking-tight">Профиль</h2>
      {debug && (
        <p className="break-all text-[10px] text-muted-foreground/60">DEBUG: {debug}</p>
      )}

      {/* User card */}
      <div className="flex items-center gap-4 rounded-2xl border border-[#e50914]/25 bg-gradient-to-br from-[#1a0507] to-background p-5 glow-red-sm">
        {isLoading ? (
          <>
            <div className="shimmer h-14 w-14 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="shimmer h-4 w-28 rounded-md" />
              <div className="shimmer h-3 w-20 rounded-md" />
            </div>
          </>
        ) : (
          <>
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#ff2d42] to-[#e50914] text-xl font-extrabold text-white shadow-[0_4px_20px_rgba(229,9,20,0.4)]">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-base font-bold">
                {displayUser.firstName} {displayUser.lastName}
              </p>
              <p className="truncate text-sm text-muted-foreground">{displayUser.telegramUsername}</p>
            </div>
          </>
        )}
      </div>

      {/* Balance */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5">
        <div className="flex items-center gap-2">
          <Wallet className="h-4 w-4 text-[#ff4d5e]" />
          <h3 className="text-sm font-bold tracking-tight">Баланс</h3>
        </div>
        <p className="mt-3 text-3xl font-extrabold tracking-tight text-gradient-red">
          {displayUser.balance} ₽
        </p>
        <p className="mt-1 text-xs text-muted-foreground">Доступно для вывода</p>
      </div>

      {/* Referral */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-[#ff4d5e]" />
          <h3 className="text-sm font-bold tracking-tight">Реферальная программа</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3.5">
            <p className="text-xl font-extrabold">{displayUser.referralCount}</p>
            <p className="text-[11px] text-muted-foreground">Приглашённых</p>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3.5">
            <p className="text-xl font-extrabold">{displayUser.referralEarnings} ₽</p>
            <p className="text-[11px] text-muted-foreground">Заработано</p>
          </div>
        </div>
        <div>
          <p className="mb-1.5 text-xs font-medium text-muted-foreground">Ваша реферальная ссылка:</p>
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
        </div>
        <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Gift className="h-3 w-3 text-[#ff4d5e]" />
          0.5% от каждого заказа приглашённых пользователей
        </p>

        {/* Referrals list */}
        {referrals.length > 0 && (
          <div className="space-y-2 border-t border-white/[0.06] pt-3">
            <p className="text-xs font-medium text-muted-foreground">Ваши рефералы:</p>
            {referrals.map((r) => {
              const u = r.referredUser;
              const name =
                [u?.firstName, u?.lastName].filter(Boolean).join(' ') ||
                (u?.telegramUsername ? `@${u.telegramUsername}` : 'Пользователь');
              return (
                <div
                  key={r.id}
                  className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.03] px-3.5 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{name}</p>
                    {u?.telegramUsername && (
                      <p className="truncate text-[11px] text-muted-foreground">
                        @{u.telegramUsername}
                      </p>
                    )}
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      r.status === 'ACTIVE'
                        ? 'bg-emerald-500/15 text-emerald-400'
                        : 'bg-white/[0.06] text-muted-foreground'
                    }`}
                  >
                    {r.status === 'ACTIVE' ? 'Активен' : r.status}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Menu */}
      <div className="space-y-2.5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="block active:scale-[0.98] transition-transform"
            >
              <div className="group flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 transition-colors hover:border-[#e50914]/25">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.04] transition-colors group-hover:border-[#e50914]/30 group-hover:bg-[#e50914]/10">
                  <Icon className="h-[18px] w-[18px] text-foreground/80 transition-colors group-hover:text-[#ff4d5e]" strokeWidth={1.8} />
                </div>
                <span className="min-w-0 flex-1 truncate text-sm font-semibold">{item.label}</span>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/50" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
