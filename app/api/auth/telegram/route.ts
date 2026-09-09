import { NextResponse } from 'next/server';
import { createOrUpdateTelegramUser } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { telegramData } = body;

    if (!telegramData || !telegramData.id) {
      return NextResponse.json({ error: 'Invalid Telegram data' }, { status: 400 });
    }

    const user = await createOrUpdateTelegramUser(telegramData);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        telegramId: user.telegramId,
        telegramUsername: user.telegramUsername,
        firstName: user.firstName,
        lastName: user.lastName,
        referralCode: user.referralCode,
      },
    });
  } catch (error) {
    console.error('Telegram auth error:', error);
    return NextResponse.json({ error: 'Telegram auth failed' }, { status: 500 });
  }
}
