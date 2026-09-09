import { NextResponse } from 'next/server';
import { paymentService } from '@/server/payment/PaymentService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { provider, amount, orderId, description, returnUrl, metadata } = body;

    if (!provider || !amount || !orderId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await paymentService.createPayment(
      provider,
      amount,
      orderId,
      description || `Оплата заказа ${orderId}`,
      returnUrl,
      metadata
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json({ error: 'Failed to create payment' }, { status: 500 });
  }
}
