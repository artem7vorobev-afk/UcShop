import { NextResponse } from 'next/server';
import { referralService } from '@/server/referral/ReferralService';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const referrals = await referralService.getReferrals(params.userId);

    return NextResponse.json(referrals);
  } catch (error) {
    console.error('Error getting referrals:', error);
    return NextResponse.json({ error: 'Failed to get referrals' }, { status: 500 });
  }
}
