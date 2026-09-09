import { NextResponse } from 'next/server';
import { paymentService } from '@/server/payment/PaymentService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const headers = request.headers;

    const { provider } = body;

    if (!provider) {
      return NextResponse.json({ error: 'Provider is required' }, { status: 400 });
    }

    const result = await paymentService.handleWebhook(provider, body, headers);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error handling webhook:', error);
    return NextResponse.json({ error: 'Failed to handle webhook' }, { status: 500 });
  }
}
