import { PaymentProvider, PaymentResult, PaymentStatusResult, RefundResult, WebhookResult } from './index';

/**
 * Mock Payment Provider для тестирования
 * Имитирует процесс оплаты без реальных транзакций
 */
export class MockPaymentProvider implements PaymentProvider {
  name = 'MockPaymentProvider';

  private payments: Map<string, MockPayment> = new Map();

  async createPayment(
    amount: number,
    orderId: string,
    description: string,
    returnUrl?: string,
    metadata?: Record<string, any>
  ): Promise<PaymentResult> {
    // Имитация задержки сети
    await this.delay(500);

    const paymentId = `mock_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    const payment: MockPayment = {
      id: paymentId,
      orderId,
      amount,
      description,
      status: 'PENDING',
      createdAt: new Date(),
      metadata,
    };

    this.payments.set(paymentId, payment);

    // Имитация URL для оплаты
    const paymentUrl = `https://mock-payment.example.com/pay/${paymentId}`;

    console.log(`[MockPayment] Created payment: ${paymentId} for order ${orderId}, amount: ${amount}₽`);

    return {
      success: true,
      paymentId,
      paymentUrl,
      providerData: { paymentUrl },
    };
  }

  async checkPaymentStatus(paymentId: string): Promise<PaymentStatusResult> {
    await this.delay(200);

    const payment = this.payments.get(paymentId);

    if (!payment) {
      return {
        success: false,
        status: 'FAILED',
        error: 'Payment not found',
      };
    }

    // Имитация автоматического завершения платежа через 5 секунд
    if (payment.status === 'PENDING') {
      const elapsed = Date.now() - payment.createdAt.getTime();
      if (elapsed > 5000) {
        payment.status = 'COMPLETED';
        payment.completedAt = new Date();
      }
    }

    return {
      success: true,
      status: payment.status,
      amount: payment.amount,
      providerData: { payment },
    };
  }

  async refundPayment(paymentId: string, amount?: number): Promise<RefundResult> {
    await this.delay(300);

    const payment = this.payments.get(paymentId);

    if (!payment) {
      return {
        success: false,
        error: 'Payment not found',
      };
    }

    if (payment.status !== 'COMPLETED') {
      return {
        success: false,
        error: 'Payment cannot be refunded',
      };
    }

    const refundAmount = amount || payment.amount;
    payment.status = 'REFUNDED';
    payment.refundedAt = new Date();
    payment.refundedAmount = refundAmount;

    const refundId = `refund_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    console.log(`[MockPayment] Refunded payment: ${paymentId}, amount: ${refundAmount}₽`);

    return {
      success: true,
      refundId,
      providerData: { payment },
    };
  }

  async handleWebhook(data: any, headers: Headers): Promise<WebhookResult> {
    await this.delay(100);

    const { paymentId, status } = data;

    if (!paymentId || !status) {
      return {
        success: false,
        error: 'Invalid webhook data',
      };
    }

    const payment = this.payments.get(paymentId);

    if (!payment) {
      return {
        success: false,
        error: 'Payment not found',
      };
    }

    // Обновляем статус на основе webhook
    if (['COMPLETED', 'FAILED', 'REFUNDED'].includes(status)) {
      payment.status = status;
      if (status === 'COMPLETED') {
        payment.completedAt = new Date();
      } else if (status === 'REFUNDED') {
        payment.refundedAt = new Date();
      }
    }

    console.log(`[MockPayment] Webhook processed: ${paymentId}, status: ${status}`);

    return {
      success: true,
      paymentId,
      status: payment.status,
    };
  }

  /**
   * Имитация оплаты для тестирования (автоматическое завершение)
   */
  async simulatePaymentSuccess(paymentId: string): Promise<void> {
    const payment = this.payments.get(paymentId);
    if (payment && payment.status === 'PENDING') {
      payment.status = 'COMPLETED';
      payment.completedAt = new Date();
      console.log(`[MockPayment] Simulated payment success: ${paymentId}`);
    }
  }

  /**
   * Имитация неудачной оплаты для тестирования
   */
  async simulatePaymentFailure(paymentId: string): Promise<void> {
    const payment = this.payments.get(paymentId);
    if (payment && payment.status === 'PENDING') {
      payment.status = 'FAILED';
      payment.failedAt = new Date();
      console.log(`[MockPayment] Simulated payment failure: ${paymentId}`);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

interface MockPayment {
  id: string;
  orderId: string;
  amount: number;
  description: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  createdAt: Date;
  completedAt?: Date;
  failedAt?: Date;
  refundedAt?: Date;
  refundedAmount?: number;
  metadata?: Record<string, any>;
}
