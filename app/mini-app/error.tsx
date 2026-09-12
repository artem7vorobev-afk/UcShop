'use client';

import { Button } from '@/components/ui/button';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default function MiniAppError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60dvh] flex-col items-center justify-center gap-4 text-center animate-fade-up">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#e50914]/25 bg-[#e50914]/10">
        <AlertTriangle className="h-8 w-8 text-[#ff4d5e]" strokeWidth={1.5} />
      </div>
      <div>
        <p className="text-base font-bold">Что-то пошло не так</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Не удалось загрузить страницу. Попробуйте ещё раз.
        </p>
      </div>
      <Button variant="neon" size="sm" onClick={reset}>
        <RotateCcw className="h-3.5 w-3.5" />
        Повторить
      </Button>
    </div>
  );
}
