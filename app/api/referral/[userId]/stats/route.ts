import { NextResponse } from 'next/server';
import { referralService } from '@/server/referral/ReferralService';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const stats = await referralService.getReferralStats(params.userId);

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error getting referral stats:', error);
    return NextResponse.json({ error: 'Failed to get referral stats' }, { status: 500 });
  }
}
