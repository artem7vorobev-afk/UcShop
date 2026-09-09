import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Получить все товары
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');

    const where = categoryId ? { categoryId } : {};

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        variants: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

// POST - Создать товар
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, slug, description, categoryId, imageUrl, isFeatured, variants } = body;

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        categoryId,
        imageUrl,
        isFeatured: isFeatured || false,
        variants: {
          create: variants || [],
        },
      },
      include: {
        variants: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
