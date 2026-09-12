import { prisma } from '@/lib/prisma';

export interface ReferralStats {
  totalReferrals: number;
  activeReferrals: number;
  totalEarned: number;
  availableBalance: number;
  referralCode: string;
}

/**
 * Сервис управления реферальной программой
 */
export class ReferralService {
  private readonly REFERRAL_PERCENTAGE = 0.5; // 0.5% от каждого заказа реферала

  /**
   * Применение реферального кода при регистрации
   */
  async applyReferralCode(userId: string, referralCode: string): Promise<boolean> {
    // Поиск референта по коду
    const referrer = await prisma.user.findFirst({
      where: { referralCode: referralCode },
    });

    if (!referrer) {
      return false;
    }

    // Пользователь не может быть своим референтом
    if (referrer.id === userId) {
      return false;
    }

    // Не перезаписываем существующего реферера
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.referredBy) {
      return false;
    }

    // Обновление пользователя с реферальным кодом
    await prisma.user.update({
      where: { id: userId },
      data: {
        referredBy: referrer.id,
      },
    });

    // Создание записи о реферале (referredUserId уникален — игнорируем дубли)
    try {
      await prisma.referral.create({
        data: {
          referrerId: referrer.id,
          referredUserId: userId,
          status: 'ACTIVE',
        },
      });
    } catch {
      /* referral record already exists */
    }

    return true;
  }

  /**
   * Начисление бонуса референту после успешного заказа
   */
  async creditReferralBonus(orderId: string): Promise<void> {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
      },
    });

    if (!order || !order.user.referredBy) {
      return;
    }

    // Расчёт бонуса (0.5% от суммы заказа)
    const bonusAmount = (Number(order.finalAmount) * this.REFERRAL_PERCENTAGE) / 100;

    if (bonusAmount <= 0) {
      return;
    }

    // Начисление бонуса референту
    await prisma.user.update({
      where: { id: order.user.referredBy },
      data: {
        balance: { increment: bonusAmount },
        referralEarnings: { increment: bonusAmount },
      },
    });

    // Создание записи о транзакции
    await prisma.referralTransaction.create({
      data: {
        referrerId: order.user.referredBy,
        orderId: orderId,
        amount: bonusAmount,
        type: 'EARNING',
      },
    });

    // Обновление статуса реферала
    await prisma.referral.updateMany({
      where: {
        referredUserId: order.userId,
        status: 'ACTIVE',
      },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
      },
    });

    console.log(`[Referral] Credited bonus: ${bonusAmount} ₽ to referrer ${order.user.referredBy} for order ${orderId}`);
  }

  /**
   * Получение статистики рефералов пользователя
   */
  async getReferralStats(userId: string): Promise<ReferralStats> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        referrals: true,
        referralTransactions: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const activeReferrals = user.referrals.filter((r: { status: string }) => r.status === 'ACTIVE').length;
    const totalEarned = Number(user.referralEarnings || 0);
    const availableBalance = Number(user.balance || 0);

    return {
      totalReferrals: user.referrals.length,
      activeReferrals,
      totalEarned,
      availableBalance,
      referralCode: user.referralCode || '',
    };
  }

  /**
   * Получение списка рефералов пользователя
   */
  async getReferrals(userId: string): Promise<any[]> {
    return prisma.referral.findMany({
      where: { referrerId: userId },
      include: {
        referredUser: {
          select: {
            id: true,
            telegramUsername: true,
            firstName: true,
            lastName: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Получение истории транзакций реферальной программы
   */
  async getReferralTransactions(userId: string): Promise<any[]> {
    return prisma.referralTransaction.findMany({
      where: { referrerId: userId },
      include: {
        order: {
          select: {
            id: true,
            orderNumber: true,
            finalAmount: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Использование реферального баланса
   */
  async useReferralBalance(userId: string, amount: number): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || Number(user.balance) < amount) {
      return false;
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        balance: { decrement: amount },
      },
    });

    // Создание записи о транзакции
    await prisma.referralTransaction.create({
      data: {
        referrerId: userId,
        amount: -amount,
        type: 'SPENDING',
      },
    });

    return true;
  }

  /**
   * Генерация реферальной ссылки
   */
  generateReferralLink(referralCode: string): string {
    const botUsername = process.env.NEXT_PUBLIC_BOT_USERNAME || 'UC_Steam_Bot';
    return `https://t.me/${botUsername}?start=ref_${referralCode}`;
  }

  /**
   * Получение реферальной информации пользователя по коду
   */
  async getReferrerByCode(code: string): Promise<any | null> {
    return prisma.user.findFirst({
      where: { referralCode: code },
      select: {
        id: true,
        telegramUsername: true,
        firstName: true,
        lastName: true,
      },
    });
  }
}

// Singleton instance
export const referralService = new ReferralService();
