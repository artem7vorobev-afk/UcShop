import { NextResponse } from 'next/server';
import { deliveryService } from '@/server/delivery/DeliveryService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { provider, orderItemId, deliveryData } = body;

    if (!provider || !orderItemId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await deliveryService.deliverProduct(provider, orderItemId, deliveryData);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error delivering product:', error);
    return NextResponse.json({ error: 'Failed to deliver product' }, { status: 500 });
  }
}
