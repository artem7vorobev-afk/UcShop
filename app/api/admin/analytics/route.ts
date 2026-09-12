import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '7d';

    // Определение даты начала периода
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case '1d':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    // Общая статистика
    const totalOrders = await prisma.order.count({
      where: { createdAt: { gte: startDate } },
    });

    const totalRevenue = await prisma.order.aggregate({
      where: { createdAt: { gte: startDate }, status: 'COMPLETED' },
      _sum: { finalAmount: true },
    });

    const totalUsers = await prisma.user.count({
      where: { createdAt: { gte: startDate } },
    });

    const totalProducts = await prisma.product.count();

    // Статистика по статусам заказов
    const ordersByStatus = await prisma.order.groupBy({
      by: ['status'],
      where: { createdAt: { gte: startDate } },
      _count: true,
    });

    // Топ товаров
    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      where: {
        order: { createdAt: { gte: startDate } },
      },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    });

    const topProductIds = topProducts.map(p => p.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: topProductIds } },
      select: { id: true, name: true },
    });

    const topProductsWithNames = topProducts.map(p => ({
      ...p,
      productName: products.find(prod => prod.id === p.productId)?.name || 'Unknown',
    }));

    // Статистика платежей
    const paymentStats = await prisma.payment.groupBy({
      by: ['provider'],
      where: { createdAt: { gte: startDate } },
      _count: true,
      _sum: { amount: true },
    });

    // Статистика промокодов
    const promoCodeStats = await prisma.promoCode.findMany({
      select: {
        code: true,
        usesCount: true,
        isActive: true,
      },
      orderBy: { usesCount: 'desc' },
      take: 5,
    });

    // Статистика баннеров
    const bannerStats = await prisma.banner.findMany({
      select: {
        id: true,
        title: true,
        viewsCount: true,
        clicksCount: true,
        isActive: true,
      },
      orderBy: { viewsCount: 'desc' },
      take: 5,
    });

    // График заказов по дням
    const ordersByDay = await prisma.$queryRaw`
      SELECT 
        DATE("createdAt") as date,
        COUNT(*) as count,
        COALESCE(SUM("finalAmount"), 0) as revenue
      FROM "Order"
      WHERE "createdAt" >= ${startDate}
      GROUP BY DATE("createdAt")
      ORDER BY date DESC
    `;

    const analytics = {
      period,
      overview: {
        totalOrders,
        totalRevenue: Number(totalRevenue._sum.finalAmount || 0),
        totalUsers,
        totalProducts,
      },
      ordersByStatus: ordersByStatus.map(s => ({
        status: s.status,
        count: s._count,
      })),
      topProducts: topProductsWithNames,
      paymentStats: paymentStats.map(s => ({
        provider: s.provider,
        count: s._count,
        totalAmount: Number(s._sum.amount || 0),
      })),
      promoCodeStats,
      bannerStats: bannerStats.map(b => ({
        ...b,
        ctr: b.viewsCount > 0 ? ((b.clicksCount / b.viewsCount) * 100).toFixed(2) : '0',
      })),
      ordersByDay,
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
