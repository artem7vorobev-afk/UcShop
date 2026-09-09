import { NextResponse } from 'next/server';
import { promoCodeService } from '@/server/promo/PromoCodeService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, orderAmount, productIds } = body;

    if (!code || orderAmount === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await promoCodeService.validatePromoCode(code, orderAmount, productIds);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error validating promo code:', error);
    return NextResponse.json({ error: 'Failed to validate promo code' }, { status: 500 });
  }
}
