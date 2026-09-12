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

  useEffect(() => {
    const authenticate = async () => {
      const tg = window.Telegram?.WebApp;
      if (!tg) {
        // Not inside Telegram webview
        setLoading(false);
        return;
      }

      tg.ready();
      tg.expand();

      const tgUser = tg.initDataUnsafe?.user;
      if (!tgUser?.id) {
        setLoading(false);
        return;
      }

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
          setUser(data.user);
        } else {
          setLoading(false);
        }
      } catch {
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
        setLoading(false);
      }, 5000);
      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [setUser, setLoading]);

  return (
    <Script
      src="https://telegram.org/js/telegram-web-app.js"
      strategy="beforeInteractive"
    />
  );
}
