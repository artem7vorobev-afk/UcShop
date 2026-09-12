import { NextResponse } from 'next/server';
import { createOrUpdateTelegramUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

const TOKEN_TTL_MS = 10 * 60 * 1000; // 10 minutes

function verifyAuthToken(token: string): string | null {
  try {
    const decoded = Buffer.from(token, 'base64url').toString();
    const [telegramId, ts, sig] = decoded.split(':');
    if (!telegramId || !ts || !sig) return null;

    const expected = crypto
      .createHmac('sha256', process.env.BOT_TOKEN || '')
      .update(`${telegramId}:${ts}`)
      .digest('hex');

    if (sig !== expected) return null;
    if (Date.now() - Number(ts) > TOKEN_TTL_MS) return null;
    return telegramId;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { telegramData, token } = body;

    // Token-based auth (fallback when initData is unavailable)
    if (token) {
      const telegramId = verifyAuthToken(token);
      if (!telegramId) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      }
      const user = await prisma.user.findUnique({ where: { telegramId } });
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
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
    }

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
