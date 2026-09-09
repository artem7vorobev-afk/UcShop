import { NextResponse } from 'next/server';
import { bannerService } from '@/server/banners/BannerService';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await bannerService.recordBannerView(params.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error recording banner view:', error);
    return NextResponse.json({ error: 'Failed to record banner view' }, { status: 500 });
  }
}
