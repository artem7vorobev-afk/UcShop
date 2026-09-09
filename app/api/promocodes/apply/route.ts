import { NextResponse } from 'next/server';
import { promoCodeService } from '@/server/promo/PromoCodeService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, promoCodeId } = body;

    if (!orderId || !promoCodeId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await promoCodeService.applyPromoCode(orderId, promoCodeId);

    return NextResponse.json({ success: true, order: result });
  } catch (error) {
    console.error('Error applying promo code:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to apply promo code' }, { status: 500 });
  }
}
