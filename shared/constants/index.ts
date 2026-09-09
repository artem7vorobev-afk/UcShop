export const APP_NAME = 'UcShop1';
export const APP_DESCRIPTION = 'Магазин цифровых товаров и игровых пополнений';
export const DEFAULT_CURRENCY = 'RUB';

export const ORDER_STATUSES = [
  'NEW',
  'AWAITING_PAYMENT',
  'PAID',
  'PROCESSING',
  'COMPLETED',
  'FAILED',
  'REFUNDED',
] as const;

export const PAYMENT_STATUSES = [
  'PENDING',
  'PAID',
  'FAILED',
  'EXPIRED',
  'CANCELLED',
] as const;

export const PAYMENT_PROVIDERS = ['MOCK', 'SBP'] as const;
