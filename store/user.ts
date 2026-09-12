import { create } from 'zustand';

export interface TelegramUser {
  id: string;
  telegramId: string;
  telegramUsername?: string;
  firstName?: string;
  lastName?: string;
  referralCode?: string;
}

interface UserState {
  user: TelegramUser | null;
  isLoading: boolean;
  debug: string;
  setUser: (user: TelegramUser | null) => void;
  setLoading: (loading: boolean) => void;
  setDebug: (debug: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoading: true,
  debug: '',
  setUser: (user) => set({ user, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
  setDebug: (debug) => set((s) => ({ debug: s.debug ? `${s.debug} | ${debug}` : debug })),
}));
