import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PUT - Обновить баннер
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { title, description, imageUrl, linkUrl, startDate, endDate, priority, targetAudience, applicableCategories, applicableProducts, isActive } = body;

    const banner = await prisma.banner.update({
      where: { id: params.id },
      data: {
        title,
        description,
        imageUrl,
        linkUrl,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        priority,
        targetAudience,
        applicableCategories,
        applicableProducts,
        isActive,
      },
    });

    return NextResponse.json(banner);
  } catch (error) {
    console.error('Error updating banner:', error);
    return NextResponse.json({ error: 'Failed to update banner' }, { status: 500 });
  }
}

// DELETE - Удалить баннер
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.banner.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting banner:', error);
    return NextResponse.json({ error: 'Failed to delete banner' }, { status: 500 });
  }
}
