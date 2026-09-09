import { DeliveryProvider, OrderItemData, DeliveryData, DeliveryResult, DeliveryStatusResult, CancellationResult, DeliveryDetails } from './index';

/**
 * Mock Delivery Provider для тестирования
 * Имитирует доставку цифровых товаров
 */
export class MockDeliveryProvider implements DeliveryProvider {
  name = 'MockDeliveryProvider';

  private deliveries: Map<string, MockDelivery> = new Map();

  async deliverProduct(
    orderItem: OrderItemData,
    deliveryData: DeliveryData
  ): Promise<DeliveryResult> {
    // Имитация задержки обработки
    await this.delay(1000);

    const deliveryId = `delivery_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    // Генерация контента доставки на основе типа товара
    const deliveryDetails = this.generateDeliveryContent(orderItem);

    const delivery: MockDelivery = {
      id: deliveryId,
      orderItem,
      deliveryData,
      status: 'COMPLETED',
      details: deliveryDetails,
      createdAt: new Date(),
      completedAt: new Date(),
    };

    this.deliveries.set(deliveryId, delivery);

    console.log(`[MockDelivery] Delivered product: ${orderItem.productName}, deliveryId: ${deliveryId}`);

    return {
      success: true,
      deliveryId,
      deliveryDetails,
      providerData: { delivery },
    };
  }

  async checkDeliveryStatus(deliveryId: string): Promise<DeliveryStatusResult> {
    await this.delay(200);

    const delivery = this.deliveries.get(deliveryId);

    if (!delivery) {
      return {
        success: false,
        status: 'FAILED',
        error: 'Delivery not found',
      };
    }

    return {
      success: true,
      status: delivery.status,
      deliveryDetails: delivery.details,
    };
  }

  async cancelDelivery(deliveryId: string): Promise<CancellationResult> {
    await this.delay(300);

    const delivery = this.deliveries.get(deliveryId);

    if (!delivery) {
      return {
        success: false,
        error: 'Delivery not found',
      };
    }

    if (delivery.status === 'CANCELLED') {
      return {
        success: false,
        error: 'Delivery already cancelled',
      };
    }

    delivery.status = 'CANCELLED';
    delivery.cancelledAt = new Date();

    console.log(`[MockDelivery] Cancelled delivery: ${deliveryId}`);

    return {
      success: true,
    };
  }

  /**
   * Генерация контента доставки на основе типа товара
   */
  private generateDeliveryContent(orderItem: OrderItemData): DeliveryDetails {
    const { productName, itemData } = orderItem;

    // Определение типа товара на основе названия
    if (productName.includes('Telegram Stars')) {
      return {
        type: 'CODE',
        content: this.generateMockCode(),
        instructions: 'Введите этот код в Telegram для получения Stars',
      };
    }

    if (productName.includes('PUBG') || productName.includes('UC')) {
      return {
        type: 'CODE',
        content: this.generateMockCode(),
        instructions: 'Введите код в игре PUBG Mobile для получения UC',
      };
    }

    if (productName.includes('Steam')) {
      return {
        type: 'GIFT_CARD',
        content: this.generateMockCode(),
        instructions: 'Активируйте код в Steam для пополнения кошелька',
      };
    }

    if (productName.includes('Roblox') || productName.includes('Robux')) {
      return {
        type: 'CODE',
        content: this.generateMockCode(),
        instructions: 'Введите код на сайте Roblox для получения Robux',
      };
    }

    if (productName.includes('Genshin') || productName.includes('Crystals')) {
      return {
        type: 'CODE',
        content: this.generateMockCode(),
        instructions: 'Введите код в игре Genshin Impact для получения кристаллов',
      };
    }

    if (productName.includes('Discord') || productName.includes('Nitro')) {
      return {
        type: 'CODE',
        content: this.generateMockCode(),
        instructions: 'Активируйте код в Discord для получения Nitro',
      };
    }

    // Дефолтный вариант
    return {
      type: 'CODE',
      content: this.generateMockCode(),
      instructions: 'Используйте этот код для получения товара',
    };
  }

  /**
   * Генерация mock кода
   */
  private generateMockCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      if (i < 3) code += '-';
    }
    return code;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

interface MockDelivery {
  id: string;
  orderItem: OrderItemData;
  deliveryData: DeliveryData;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  details: DeliveryDetails;
  createdAt: Date;
  completedAt?: Date;
  cancelledAt?: Date;
}
