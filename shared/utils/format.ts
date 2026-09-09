export function formatPrice(price: number, currency: string = 'RUB'): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function formatOrderStatus(status: string): string {
  const statusMap: Record<string, string> = {
    NEW: 'Новый',
    AWAITING_PAYMENT: 'Ожидает оплаты',
    PAID: 'Оплачен',
    PROCESSING: 'В обработке',
    COMPLETED: 'Выполнен',
    FAILED: 'Ошибка',
    REFUNDED: 'Возврат',
  };
  return statusMap[status] || status;
}

export function formatPaymentStatus(status: string): string {
  const statusMap: Record<string, string> = {
    PENDING: 'Ожидает',
    PAID: 'Оплачено',
    FAILED: 'Ошибка',
    EXPIRED: 'Истёк',
    CANCELLED: 'Отменён',
  };
  return statusMap[status] || status;
}
