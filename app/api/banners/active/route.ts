import { NextResponse } from 'next/server';
import { bannerService } from '@/server/banners/BannerService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userType = searchParams.get('userType') as 'NEW' | 'RETURNING' | undefined;

    const banners = await bannerService.getActiveBanners(userType);

    return NextResponse.json(banners);
  } catch (error) {
    console.error('Error getting active banners:', error);
    return NextResponse.json({ error: 'Failed to get active banners' }, { status: 500 });
  }
}
