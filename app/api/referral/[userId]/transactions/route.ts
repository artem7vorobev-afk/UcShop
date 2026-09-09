import { NextResponse } from 'next/server';
import { referralService } from '@/server/referral/ReferralService';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const transactions = await referralService.getReferralTransactions(params.userId);

    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Error getting referral transactions:', error);
    return NextResponse.json({ error: 'Failed to get referral transactions' }, { status: 500 });
  }
}
