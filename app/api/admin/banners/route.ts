import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Получить все баннеры
export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: [
        { priority: 'desc' },
        { order: 'asc' },
      ],
    });

    return NextResponse.json(banners);
  } catch (error) {
    console.error('Error fetching banners:', error);
    return NextResponse.json({ error: 'Failed to fetch banners' }, { status: 500 });
  }
}

// POST - Создать баннер
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, imageUrl, linkUrl, startDate, endDate, priority, targetAudience, applicableCategories, applicableProducts } = body;

    const banner = await prisma.banner.create({
      data: {
        title,
        description,
        imageUrl,
        linkUrl,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        priority: priority || 0,
        targetAudience: targetAudience || 'ALL',
        applicableCategories,
        applicableProducts,
        isActive: true,
        viewsCount: 0,
        clicksCount: 0,
      },
    });

    return NextResponse.json(banner);
  } catch (error) {
    console.error('Error creating banner:', error);
    return NextResponse.json({ error: 'Failed to create banner' }, { status: 500 });
  }
}
