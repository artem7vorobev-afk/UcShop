import { prisma } from '@/lib/prisma';

export interface PromoCodeData {
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  maxUses?: number;
  expiresAt?: Date;
  minOrderAmount?: number;
  applicableProducts?: string[]; // product IDs
  applicableCategories?: string[]; // category IDs
}

export interface PromoCodeValidationResult {
  valid: boolean;
  promoCode?: any;
  discountAmount?: number;
  error?: string;
}

/**
 * Сервис управления промокодами
 */
export class PromoCodeService {
  /**
   * Создание промокода
   */
  async createPromoCode(data: PromoCodeData): Promise<any> {
    return prisma.promoCode.create({
      data: {
        code: data.code.toUpperCase(),
        discountType: data.discountType,
        discountValue: data.discountValue,
        maxUses: data.maxUses,
        expiresAt: data.expiresAt,
        minOrderAmount: data.minOrderAmount,
        applicableProducts: data.applicableProducts,
        applicableCategories: data.applicableCategories,
        isActive: true,
        usesCount: 0,
      },
    });
  }

  /**
   * Валидация промокода
   */
  async validatePromoCode(code: string, orderAmount: number, productIds?: string[]): Promise<PromoCodeValidationResult> {
    const promoCode = await prisma.promoCode.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!promoCode) {
      return { valid: false, error: 'Промокод не найден' };
    }

    if (!promoCode.isActive) {
      return { valid: false, error: 'Промокод неактивен' };
    }

    if (promoCode.expiresAt && promoCode.expiresAt < new Date()) {
      return { valid: false, error: 'Промокод истёк' };
    }

    if (promoCode.maxUses && promoCode.usesCount >= promoCode.maxUses) {
      return { valid: false, error: 'Лимит использований исчерпан' };
    }

    if (promoCode.minOrderAmount && orderAmount < promoCode.minOrderAmount) {
      return { valid: false, error: `Минимальная сумма заказа: ${promoCode.minOrderAmount} ₽` };
    }

    // Проверка применимости к товарам
    if (promoCode.applicableProducts && promoCode.applicableProducts.length > 0 && productIds) {
      const hasApplicableProduct = productIds.some(id => 
        promoCode.applicableProducts?.includes(id)
      );
      if (!hasApplicableProduct) {
        return { valid: false, error: 'Промокод не применим к выбранным товарам' };
      }
    }

    // Расчёт скидки
    let discountAmount = 0;
    if (promoCode.discountType === 'PERCENTAGE') {
      discountAmount = (orderAmount * promoCode.discountValue) / 100;
    } else {
      discountAmount = promoCode.discountValue;
    }

    return {
      valid: true,
      promoCode,
      discountAmount,
    };
  }

  /**
   * Применение промокода к заказу
   */
  async applyPromoCode(orderId: string, promoCodeId: string): Promise<any> {
    const promoCode = await prisma.promoCode.findUnique({
      where: { id: promoCodeId },
    });

    if (!promoCode) {
      throw new Error('Промокод не найден');
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      throw new Error('Заказ не найден');
    }

    // Валидация
    const productIds = order.items.map(item => item.productId);
    const validation = await this.validatePromoCode(promoCode.code, Number(order.totalAmount), productIds);

    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // Применение скидки
    const discountAmount = validation.discountAmount || 0;
    const finalAmount = Math.max(0, Number(order.totalAmount) - discountAmount);

    // Обновление заказа
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        promoCodeId: promoCodeId,
        discountAmount: discountAmount,
        finalAmount: finalAmount,
      },
    });

    // Увеличение счётчика использований
    await prisma.promoCode.update({
      where: { id: promoCodeId },
      data: {
        usesCount: { increment: 1 },
      },
    });

    return updatedOrder;
  }

  /**
   * Получение всех промокодов
   */
  async getAllPromoCodes(): Promise<any[]> {
    return prisma.promoCode.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Получение промокода по коду
   */
  async getPromoCodeByCode(code: string): Promise<any | null> {
    return prisma.promoCode.findUnique({
      where: { code: code.toUpperCase() },
    });
  }

  /**
   * Деактивация промокода
   */
  async deactivatePromoCode(id: string): Promise<any> {
    return prisma.promoCode.update({
      where: { id },
      data: { isActive: false },
    });
  }

  /**
   * Генерация случайного промокода
   */
  generateRandomCode(prefix: string = 'PROMO'): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = prefix;
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }
}

// Singleton instance
export const promoCodeService = new PromoCodeService();
