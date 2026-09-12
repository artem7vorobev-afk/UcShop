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
  setUser: (user: TelegramUser | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
}));
