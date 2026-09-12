import { PaymentProvider } from './providers';
import { MockPaymentProvider } from './providers/MockPaymentProvider';
import { SBPPaymentProvider, SBPConfig } from './providers/SBPPaymentProvider';
import { prisma } from '@/lib/prisma';
import { referralService } from '@/server/referral/ReferralService';

/**
 * Сервис управления платежами
 * Координирует работу с провайдерами платежей
 */
export class PaymentService {
  private providers: Map<string, PaymentProvider> = new Map();

  constructor() {
    // Инициализация провайдеров
    this.registerProvider('MOCK', new MockPaymentProvider());

    // SBP провайдер инициализируется при наличии конфигурации
    const sbpConfig = this.getSBPConfig();
    if (sbpConfig) {
      this.registerProvider('SBP', new SBPPaymentProvider(sbpConfig));
    }
  }

  /**
   * Регистрация провайдера платежей
   */
  registerProvider(name: string, provider: PaymentProvider): void {
    this.providers.set(name, provider);
  }

  /**
   * Получение провайдера по имени
   */
  getProvider(name: string): PaymentProvider | undefined {
    return this.providers.get(name);
  }

  /**
   * Создание платежа
   */
  async createPayment(
    providerName: string,
    amount: number,
    orderId: string,
    description: string,
    returnUrl?: string,
    metadata?: Record<string, any>
  ) {
    const provider = this.getProvider(providerName);
    if (!provider) {
      throw new Error(`Payment provider not found: ${providerName}`);
    }

    const result = await provider.createPayment(amount, orderId, description, returnUrl, metadata);

    if (result.success && result.paymentId) {
      // Сохранение информации о платеже в БД
      await prisma.payment.create({
        data: {
          orderId,
          provider: providerName as any,
          providerPaymentId: result.paymentId,
          amount,
          currency: 'RUB',
          status: 'PENDING',
          providerData: result.providerData,
        },
      });
    }

    return result;
  }

  /**
   * Проверка статуса платежа
   */
  async checkPaymentStatus(providerName: string, paymentId: string) {
    const provider = this.getProvider(providerName);
    if (!provider) {
      throw new Error(`Payment provider not found: ${providerName}`);
    }

    const result = await provider.checkPaymentStatus(paymentId);

    // Обновление статуса в БД
    if (result.success) {
      await prisma.payment.updateMany({
        where: { providerPaymentId: paymentId },
        data: {
          status: result.status as any,
          providerData: result.providerData,
        },
      });
    }

    return result;
  }

  /**
   * Возврат платежа
   */
  async refundPayment(providerName: string, paymentId: string, amount?: number) {
    const provider = this.getProvider(providerName);
    if (!provider) {
      throw new Error(`Payment provider not found: ${providerName}`);
    }

    const result = await provider.refundPayment(paymentId, amount);

    // Обновление статуса в БД
    if (result.success) {
      await prisma.payment.updateMany({
        where: { providerPaymentId: paymentId },
        data: {
          status: 'REFUNDED',
          providerData: result.providerData,
        },
      });
    }

    return result;
  }

  /**
   * Обработка webhook
   */
  async handleWebhook(providerName: string, data: any, headers: Headers) {
    const provider = this.getProvider(providerName);
    if (!provider) {
      throw new Error(`Payment provider not found: ${providerName}`);
    }

    const result = await provider.handleWebhook(data, headers);

    // Обновление статуса платежа в БД
    if (result.success && result.paymentId && result.status) {
      await prisma.payment.updateMany({
        where: { providerPaymentId: result.paymentId },
        data: {
          status: result.status as any,
        },
      });

      // Если платеж успешен, обновляем статус заказа
      if (result.status === 'COMPLETED') {
        const payment = await prisma.payment.findFirst({
          where: { providerPaymentId: result.paymentId },
        });

        if (payment) {
          await prisma.order.update({
            where: { id: payment.orderId },
            data: { status: 'PAID' },
          });

          // Начисление 0.5% рефереру
          try {
            await referralService.creditReferralBonus(payment.orderId);
          } catch (e) {
            console.error('Referral bonus error:', e);
          }
        }
      }
    }

    return result;
  }

  /**
   * Получение конфигурации SBP из переменных окружения
   */
  private getSBPConfig(): SBPConfig | null {
    const apiKey = process.env.SBP_API_KEY;
    const merchantId = process.env.SBP_MERCHANT_ID;
    const apiUrl = process.env.SBP_API_URL;

    if (!apiKey || !merchantId) {
      return null;
    }

    return {
      apiKey,
      merchantId,
      apiUrl,
    };
  }
}

// Singleton instance
export const paymentService = new PaymentService();
