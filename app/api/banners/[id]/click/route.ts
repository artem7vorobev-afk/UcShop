import { NextResponse } from 'next/server';
import { bannerService } from '@/server/banners/BannerService';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await bannerService.recordBannerClick(params.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error recording banner click:', error);
    return NextResponse.json({ error: 'Failed to record banner click' }, { status: 500 });
  }
}
