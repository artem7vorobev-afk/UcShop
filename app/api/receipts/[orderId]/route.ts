import { NextResponse } from 'next/server';
import { ReceiptGenerator } from '@/server/receipts/ReceiptGenerator';

export async function GET(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const format = (searchParams.get('format') as 'text' | 'html') || 'text';

    // Проверяем, есть ли сохранённый чек
    const existingReceipt = await ReceiptGenerator.getReceipt(params.orderId);
    
    if (existingReceipt) {
      return NextResponse.json({
        content: existingReceipt.content,
        format: existingReceipt.format,
      });
    }

    // Генерируем новый чек
    const receipt = await ReceiptGenerator.generateReceiptFromOrder(params.orderId, format);
    
    // Сохраняем чек
    await ReceiptGenerator.saveReceipt(params.orderId, receipt, format);

    return NextResponse.json({
      content: receipt,
      format,
    });
  } catch (error) {
    console.error('Error generating receipt:', error);
    return NextResponse.json({ error: 'Failed to generate receipt' }, { status: 500 });
  }
}
