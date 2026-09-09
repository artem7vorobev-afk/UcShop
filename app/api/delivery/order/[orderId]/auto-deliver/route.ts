import { NextResponse } from 'next/server';
import { deliveryService } from '@/server/delivery/DeliveryService';

export async function POST(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const results = await deliveryService.autoDeliverOrder(params.orderId);

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error('Error auto-delivering order:', error);
    return NextResponse.json({ error: 'Failed to auto-deliver order' }, { status: 500 });
  }
}
