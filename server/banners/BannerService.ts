import { prisma } from '@/lib/prisma';

export interface BannerData {
  title: string;
  description: string;
  imageUrl: string;
  linkUrl?: string;
  startDate?: Date;
  endDate?: Date;
  priority?: number;
  targetAudience?: 'ALL' | 'NEW_USERS' | 'RETURNING_USERS';
  applicableCategories?: string[];
  applicableProducts?: string[];
}

/**
 * Сервис управления баннерами и акциями
 */
export class BannerService {
  /**
   * Создание баннера
   */
  async createBanner(data: BannerData): Promise<any> {
    return prisma.banner.create({
      data: {
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        linkUrl: data.linkUrl,
        startDate: data.startDate,
        endDate: data.endDate,
        priority: data.priority || 0,
        targetAudience: data.targetAudience || 'ALL',
        applicableCategories: data.applicableCategories,
        applicableProducts: data.applicableProducts,
        isActive: true,
      },
    });
  }

  /**
   * Получение активных баннеров
   */
  async getActiveBanners(userType?: 'NEW' | 'RETURNING'): Promise<any[]> {
    const now = new Date();

    const where: any = {
      isActive: true,
      OR: [
        { startDate: null },
        { startDate: { lte: now } },
      ],
      AND: [
        { endDate: null },
        { endDate: { gte: now } },
      ],
    };

    // Фильтрация по типу пользователя
    if (userType === 'NEW') {
      where.targetAudience = { in: ['ALL', 'NEW_USERS'] };
    } else if (userType === 'RETURNING') {
      where.targetAudience = { in: ['ALL', 'RETURNING_USERS'] };
    }

    return prisma.banner.findMany({
      where,
      orderBy: [
        { priority: 'desc' },
        { order: 'asc' },
      ],
    });
  }

  /**
   * Получение всех баннеров (для админки)
   */
  async getAllBanners(): Promise<any[]> {
    return prisma.banner.findMany({
      orderBy: [
        { priority: 'desc' },
        { order: 'asc' },
      ],
    });
  }

  /**
   * Получение баннера по ID
   */
  async getBannerById(id: string): Promise<any | null> {
    return prisma.banner.findUnique({
      where: { id },
    });
  }

  /**
   * Обновление баннера
   */
  async updateBanner(id: string, data: Partial<BannerData>): Promise<any> {
    return prisma.banner.update({
      where: { id },
      data,
    });
  }

  /**
   * Активация/деактивация баннера
   */
  async toggleBanner(id: string, isActive: boolean): Promise<any> {
    return prisma.banner.update({
      where: { id },
      data: { isActive },
    });
  }

  /**
   * Удаление баннера
   */
  async deleteBanner(id: string): Promise<any> {
    return prisma.banner.delete({
      where: { id },
    });
  }

  /**
   * Обновление приоритета баннера
   */
  async updateBannerPriority(id: string, priority: number): Promise<any> {
    return prisma.banner.update({
      where: { id },
      data: { priority },
    });
  }

  /**
   * Получение статистики показов баннера
   */
  async getBannerStats(id: string): Promise<any> {
    const banner = await prisma.banner.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        viewsCount: true,
        clicksCount: true,
        createdAt: true,
      },
    });

    if (!banner) {
      throw new Error('Banner not found');
    }

    const ctr = banner.viewsCount > 0 
      ? (banner.clicksCount / banner.viewsCount) * 100 
      : 0;

    return {
      ...banner,
      ctr: ctr.toFixed(2),
    };
  }

  /**
   * Регистрация просмотра баннера
   */
  async recordBannerView(id: string): Promise<void> {
    await prisma.banner.update({
      where: { id },
      data: {
        viewsCount: { increment: 1 },
      },
    });
  }

  /**
   * Регистрация клика по баннеру
   */
  async recordBannerClick(id: string): Promise<void> {
    await prisma.banner.update({
      where: { id },
      data: {
        clicksCount: { increment: 1 },
      },
    });
  }

  /**
   * Получение баннеров для конкретной категории
   */
  async getBannersForCategory(categoryId: string): Promise<any[]> {
    const banners = await this.getActiveBanners();

    return banners.filter(banner => {
      if (!banner.applicableCategories || banner.applicableCategories.length === 0) {
        return true; // Баннер применим ко всем категориям
      }
      return banner.applicableCategories.includes(categoryId);
    });
  }

  /**
   * Получение баннеров для конкретного товара
   */
  async getBannersForProduct(productId: string): Promise<any[]> {
    const banners = await this.getActiveBanners();

    return banners.filter(banner => {
      if (!banner.applicableProducts || banner.applicableProducts.length === 0) {
        return true; // Баннер применим ко всем товарам
      }
      return banner.applicableProducts.includes(productId);
    });
  }
}

// Singleton instance
export const bannerService = new BannerService();
