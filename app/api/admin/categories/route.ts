import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Получить все категории
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

// POST - Создать категорию
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, slug, description, imageUrl, order } = body;

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        imageUrl,
        order: order || 0,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
