import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Получить все промокоды
export async function GET() {
  try {
    const promocodes = await prisma.promoCode.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(promocodes);
  } catch (error) {
    console.error('Error fetching promocodes:', error);
    return NextResponse.json({ error: 'Failed to fetch promocodes' }, { status: 500 });
  }
}

// POST - Создать промокод
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, discountType, discountValue, maxUses, expiresAt, minOrderAmount, applicableProducts, applicableCategories } = body;

    const promocode = await prisma.promoCode.create({
      data: {
        code: code.toUpperCase(),
        discountType,
        discountValue,
        maxUses,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        minOrderAmount,
        applicableProducts,
        applicableCategories,
        isActive: true,
        usesCount: 0,
      },
    });

    return NextResponse.json(promocode);
  } catch (error) {
    console.error('Error creating promocode:', error);
    return NextResponse.json({ error: 'Failed to create promocode' }, { status: 500 });
  }
}
