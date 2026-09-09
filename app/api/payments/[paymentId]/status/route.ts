import { NextResponse } from 'next/server';
import { paymentService } from '@/server/payment/PaymentService';

export async function GET(
  request: Request,
  { params }: { params: { paymentId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const provider = searchParams.get('provider');

    if (!provider) {
      return NextResponse.json({ error: 'Provider is required' }, { status: 400 });
    }

    const result = await paymentService.checkPaymentStatus(provider, params.paymentId);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error checking payment status:', error);
    return NextResponse.json({ error: 'Failed to check payment status' }, { status: 500 });
  }
}
