import { NextResponse } from 'next/server';
import { referralService } from '@/server/referral/ReferralService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, referralCode } = body;

    if (!userId || !referralCode) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const success = await referralService.applyReferralCode(userId, referralCode);

    return NextResponse.json({ success });
  } catch (error) {
    console.error('Error applying referral code:', error);
    return NextResponse.json({ error: 'Failed to apply referral code' }, { status: 500 });
  }
}
