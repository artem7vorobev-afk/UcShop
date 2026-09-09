import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PUT - Обновить промокод
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { code, discountType, discountValue, maxUses, expiresAt, minOrderAmount, applicableProducts, applicableCategories, isActive } = body;

    const promocode = await prisma.promoCode.update({
      where: { id: params.id },
      data: {
        code: code?.toUpperCase(),
        discountType,
        discountValue,
        maxUses,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        minOrderAmount,
        applicableProducts,
        applicableCategories,
        isActive,
      },
    });

    return NextResponse.json(promocode);
  } catch (error) {
    console.error('Error updating promocode:', error);
    return NextResponse.json({ error: 'Failed to update promocode' }, { status: 500 });
  }
}

// DELETE - Удалить промокод
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.promoCode.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting promocode:', error);
    return NextResponse.json({ error: 'Failed to delete promocode' }, { status: 500 });
  }
}
