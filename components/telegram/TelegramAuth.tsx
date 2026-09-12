'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { useUserStore } from '@/store/user';

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        ready: () => void;
        expand: () => void;
        initData: string;
        initDataUnsafe: {
          user?: {
            id: number;
            username?: string;
            first_name?: string;
            last_name?: string;
          };
        };
      };
    };
  }
}

export function TelegramAuth() {
  const setUser = useUserStore((s) => s.setUser);
  const setLoading = useUserStore((s) => s.setLoading);
  const setDebug = useUserStore((s) => s.setDebug);

  useEffect(() => {
    const authenticate = async () => {
      const tg = window.Telegram?.WebApp;
      if (!tg) {
        setDebug('no Telegram.WebApp');
        setLoading(false);
        return;
      }

      const w = window as any;
      const hasProxy = typeof w.TelegramWebviewProxy !== 'undefined';
      const platform = tg.initDataUnsafe ? (w.Telegram.WebApp as any).platform : '?';
      const version = (w.Telegram.WebApp as any).version || '?';
      const href = window.location.href.slice(0, 80);
      setDebug(
        `initData=${tg.initData ? 'yes' : 'empty'} proxy=${hasProxy} platform=${platform} ver=${version} url=${href}`
      );
      tg.ready();
      tg.expand();

      const tgUser = tg.initDataUnsafe?.user;
      const authToken = new URLSearchParams(window.location.search).get('auth');

      if (!tgUser?.id) {
        // initData unavailable (stub mode) — fall back to signed token in URL
        if (authToken) {
          setDebug('no initData, trying token');
          await authenticateWithToken(authToken);
        } else {
          setDebug('no initDataUnsafe.user, no token');
          setLoading(false);
        }
        return;
      }

      setDebug(`tgUser id=${tgUser.id}`);

      try {
        const res = await fetch('/api/auth/telegram', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            telegramData: {
              id: String(tgUser.id),
              username: tgUser.username,
              first_name: tgUser.first_name,
              last_name: tgUser.last_name,
            },
          }),
        });

        if (res.ok) {
          const data = await res.json();
          setDebug(`auth ok: ${data.user?.firstName || '?'}`);
          setUser(data.user);
        } else {
          setDebug(`auth fail ${res.status}`);
          setLoading(false);
        }
      } catch (e) {
        setDebug(`auth error ${String(e)}`);
        setLoading(false);
      }
    };

    const authenticateWithToken = async (token: string) => {
      try {
        const res = await fetch('/api/auth/telegram', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });
        if (res.ok) {
          const data = await res.json();
          setDebug(`token auth ok: ${data.user?.firstName || '?'}`);
          setUser(data.user);
        } else {
          setDebug(`token auth fail ${res.status}`);
          setLoading(false);
        }
      } catch (e) {
        setDebug(`token auth error ${String(e)}`);
        setLoading(false);
      }
    };

    // SDK script may still be loading — retry briefly
    if (window.Telegram?.WebApp) {
      authenticate();
    } else {
      const interval = setInterval(() => {
        if (window.Telegram?.WebApp) {
          clearInterval(interval);
          authenticate();
        }
      }, 100);
      const timeout = setTimeout(() => {
        clearInterval(interval);
        const authToken = new URLSearchParams(window.location.search).get('auth');
        if (authToken) {
          setDebug('sdk timeout, trying token');
          authenticateWithToken(authToken);
        } else {
          setDebug('sdk timeout 5s');
          setLoading(false);
        }
      }, 5000);
      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [setUser, setLoading, setDebug]);

  return (
    <Script
      src="https://telegram.org/js/telegram-web-app.js"
      strategy="afterInteractive"
    />
  );
}
