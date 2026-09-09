export interface PaymentProvider {
  name: string;
  
  /**
   * Создание платежа
   * @param amount Сумма в рублях
   * @param orderId ID заказа
   * @param description Описание платежа
   * @param returnUrl URL для возврата после оплаты
   * @param metadata Дополнительные данные
   */
  createPayment(
    amount: number,
    orderId: string,
    description: string,
    returnUrl?: string,
    metadata?: Record<string, any>
  ): Promise<PaymentResult>;

  /**
   * Проверка статуса платежа
   * @param paymentId ID платежа у провайдера
   */
  checkPaymentStatus(paymentId: string): Promise<PaymentStatusResult>;

  /**
   * Возврат платежа
   * @param paymentId ID платежа у провайдера
   * @param amount Сумма для возврата (полный возврат если не указано)
   */
  refundPayment(paymentId: string, amount?: number): Promise<RefundResult>;

  /**
   * Обработка webhook от провайдера
   * @param data Данные от провайдера
   * @param headers Заголовки запроса
   */
  handleWebhook(data: any, headers: Headers): Promise<WebhookResult>;
}

export interface PaymentResult {
  success: boolean;
  paymentId?: string;
  paymentUrl?: string;
  error?: string;
  providerData?: Record<string, any>;
}

export interface PaymentStatusResult {
  success: boolean;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  amount?: number;
  error?: string;
  providerData?: Record<string, any>;
}

export interface RefundResult {
  success: boolean;
  refundId?: string;
  error?: string;
  providerData?: Record<string, any>;
}

export interface WebhookResult {
  success: boolean;
  paymentId?: string;
  status?: string;
  error?: string;
}
