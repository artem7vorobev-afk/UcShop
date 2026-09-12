import { DeliveryProvider } from './providers';
import { MockDeliveryProvider } from './providers/MockDeliveryProvider';
import { prisma } from '@/lib/prisma';

/**
 * Сервис управления доставкой товаров
 * Координирует работу с провайдерами доставки
 */
export class DeliveryService {
  private providers: Map<string, DeliveryProvider> = new Map();

  constructor() {
    // Инициализация провайдеров
    this.registerProvider('MOCK', new MockDeliveryProvider());
  }

  /**
   * Регистрация провайдера доставки
   */
  registerProvider(name: string, provider: DeliveryProvider): void {
    this.providers.set(name, provider);
  }

  /**
   * Получение провайдера по имени
   */
  getProvider(name: string): DeliveryProvider | undefined {
    return this.providers.get(name);
  }

  /**
   * Доставка товара
   */
  async deliverProduct(
    providerName: string,
    orderItemId: string,
    deliveryData: any
  ) {
    const provider = this.getProvider(providerName);
    if (!provider) {
      throw new Error(`Delivery provider not found: ${providerName}`);
    }

    // Получение данных о позиции заказа
    const orderItem = await prisma.orderItem.findUnique({
      where: { id: orderItemId },
      include: {
        product: true,
        variant: true,
      },
    });

    if (!orderItem) {
      throw new Error('Order item not found');
    }

    const orderItemData = {
      productId: orderItem.productId,
      productName: orderItem.product.name,
      variantId: orderItem.variantId,
      variantName: orderItem.variant.name,
      quantity: orderItem.quantity,
      itemData: orderItem.itemData,
    };

    const result = await provider.deliverProduct(orderItemData, deliveryData);

    if (result.success && result.deliveryId && result.deliveryDetails) {
      // Сохранение информации о доставке
      await prisma.orderItem.update({
        where: { id: orderItemId },
        data: {
          deliveryId: result.deliveryId,
          deliveryDetails: result.deliveryDetails as any,
          deliveryStatus: 'COMPLETED',
          deliveredAt: new Date(),
        },
      });

      // Обновление статуса заказа если все позиции доставлены
      const order = await prisma.order.findUnique({
        where: { id: orderItem.orderId },
        include: { items: true },
      });

      if (order) {
        const allDelivered = order.items.every(item => item.deliveryStatus === 'COMPLETED');
        if (allDelivered) {
          await prisma.order.update({
            where: { id: order.id },
            data: { status: 'COMPLETED' },
          });
        }
      }
    }

    return result;
  }

  /**
   * Проверка статуса доставки
   */
  async checkDeliveryStatus(providerName: string, deliveryId: string) {
    const provider = this.getProvider(providerName);
    if (!provider) {
      throw new Error(`Delivery provider not found: ${providerName}`);
    }

    const result = await provider.checkDeliveryStatus(deliveryId);

    // Обновление статуса в БД
    if (result.success) {
      await prisma.orderItem.updateMany({
        where: { deliveryId },
        data: {
          deliveryStatus: result.status as any,
          deliveryDetails: result.deliveryDetails as any,
        },
      });
    }

    return result;
  }

  /**
   * Отмена доставки
   */
  async cancelDelivery(providerName: string, deliveryId: string) {
    const provider = this.getProvider(providerName);
    if (!provider) {
      throw new Error(`Delivery provider not found: ${providerName}`);
    }

    const result = await provider.cancelDelivery(deliveryId);

    // Обновление статуса в БД
    if (result.success) {
      await prisma.orderItem.updateMany({
        where: { deliveryId },
        data: {
          deliveryStatus: 'CANCELLED',
        },
      });
    }

    return result;
  }

  /**
   * Автоматическая доставка всех позиций заказа
   */
  async autoDeliverOrder(orderId: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
        user: true,
      },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    const orderData = (order.orderData || {}) as Record<string, any>;
    const deliveryData = {
      userId: order.userId,
      telegramId: order.telegramId || undefined,
      email: orderData.email,
      phone: orderData.phone,
    };

    const results = [];

    for (const item of order.items) {
      if (item.deliveryStatus !== 'COMPLETED') {
        const result = await this.deliverProduct('MOCK', item.id, deliveryData);
        results.push({
          orderItemId: item.id,
          result,
        });
      }
    }

    return results;
  }
}

// Singleton instance
export const deliveryService = new DeliveryService();
