import { prisma } from '@/lib/prisma';

export interface ReceiptData {
  orderId: string;
  orderNumber: string;
  createdAt: Date;
  items: Array<{
    productName: string;
    variantName: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  currency: string;
  paymentMethod: string;
  paymentStatus: string;
  customerInfo: {
    name?: string;
    email?: string;
    phone?: string;
  };
}

/**
 * Генератор чеков
 * Создаёт текстовый или PDF чек для заказа
 */
export class ReceiptGenerator {
  /**
   * Генерация текстового чека
   */
  static generateTextReceipt(data: ReceiptData): string {
    const lines: string[] = [];

    // Заголовок
    lines.push('═'.repeat(50));
    lines.push('           UcShop1 - ЧЕК');
    lines.push('═'.repeat(50));
    lines.push('');

    // Информация о заказе
    lines.push(`Заказ №: ${data.orderNumber}`);
    lines.push(`Дата: ${data.createdAt.toLocaleString('ru-RU')}`);
    lines.push('');

    // Товары
    lines.push('─'.repeat(50));
    lines.push('ТОВАРЫ:');
    lines.push('─'.repeat(50));

    data.items.forEach((item, index) => {
      lines.push(`${index + 1}. ${item.productName}`);
      lines.push(`   ${item.variantName} x ${item.quantity}`);
      lines.push(`   ${item.price} ₽`);
      lines.push('');
    });

    // Итого
    lines.push('─'.repeat(50));
    lines.push(`ИТОГО: ${data.totalAmount} ${data.currency}`);
    lines.push('─'.repeat(50));
    lines.push('');

    // Информация о платеже
    lines.push('СПИСОБ ОПЛАТЫ:');
    lines.push(`${data.paymentMethod}`);
    lines.push(`Статус: ${data.paymentStatus}`);
    lines.push('');

    // Информация о клиенте
    if (data.customerInfo.name || data.customerInfo.email || data.customerInfo.phone) {
      lines.push('─'.repeat(50));
      lines.push('КЛИЕНТ:');
      lines.push('─'.repeat(50));
      if (data.customerInfo.name) lines.push(`Имя: ${data.customerInfo.name}`);
      if (data.customerInfo.email) lines.push(`Email: ${data.customerInfo.email}`);
      if (data.customerInfo.phone) lines.push(`Телефон: ${data.customerInfo.phone}`);
      lines.push('');
    }

    // Футер
    lines.push('═'.repeat(50));
    lines.push('Спасибо за покупку!');
    lines.push('UcShop1 - Магазин цифровых товаров');
    lines.push('═'.repeat(50));

    return lines.join('\n');
  }

  /**
   * Генерация HTML чека
   */
  static generateHTMLReceipt(data: ReceiptData): string {
    const itemsHTML = data.items
      .map(
        (item) => `
        <tr>
          <td>${item.productName}</td>
          <td>${item.variantName}</td>
          <td>${item.quantity}</td>
          <td>${item.price} ₽</td>
        </tr>
      `
      )
      .join('');

    return `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Чек - UcShop1</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background: #1a1a2e;
      color: #eee;
    }
    .receipt {
      background: #16213e;
      border: 2px solid #0f3460;
      border-radius: 10px;
      padding: 20px;
    }
    .header {
      text-align: center;
      border-bottom: 2px solid #e94560;
      padding-bottom: 15px;
      margin-bottom: 20px;
    }
    .header h1 {
      color: #e94560;
      margin: 0;
    }
    .info {
      margin-bottom: 20px;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    th, td {
      padding: 10px;
      text-align: left;
      border-bottom: 1px solid #0f3460;
    }
    th {
      background: #0f3460;
      color: #e94560;
    }
    .total {
      text-align: right;
      font-size: 1.2em;
      font-weight: bold;
      color: #e94560;
      margin-top: 20px;
    }
    .footer {
      text-align: center;
      margin-top: 20px;
      padding-top: 15px;
      border-top: 2px solid #e94560;
      color: #888;
    }
  </style>
</head>
<body>
  <div class="receipt">
    <div class="header">
      <h1>UcShop1 - ЧЕК</h1>
    </div>

    <div class="info">
      <div class="info-row">
        <span>Заказ №:</span>
        <span>${data.orderNumber}</span>
      </div>
      <div class="info-row">
        <span>Дата:</span>
        <span>${data.createdAt.toLocaleString('ru-RU')}</span>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Товар</th>
          <th>Вариант</th>
          <th>Кол-во</th>
          <th>Цена</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHTML}
      </tbody>
    </table>

    <div class="total">
      ИТОГО: ${data.totalAmount} ${data.currency}
    </div>

    <div class="info">
      <div class="info-row">
        <span>Способ оплаты:</span>
        <span>${data.paymentMethod}</span>
      </div>
      <div class="info-row">
        <span>Статус:</span>
        <span>${data.paymentStatus}</span>
      </div>
    </div>

    ${data.customerInfo.name || data.customerInfo.email || data.customerInfo.phone ? `
    <div class="info">
      <h3>Клиент:</h3>
      ${data.customerInfo.name ? `<div class="info-row"><span>Имя:</span><span>${data.customerInfo.name}</span></div>` : ''}
      ${data.customerInfo.email ? `<div class="info-row"><span>Email:</span><span>${data.customerInfo.email}</span></div>` : ''}
      ${data.customerInfo.phone ? `<div class="info-row"><span>Телефон:</span><span>${data.customerInfo.phone}</span></div>` : ''}
    </div>
    ` : ''}

    <div class="footer">
      <p>Спасибо за покупку!</p>
      <p>UcShop1 - Магазин цифровых товаров</p>
    </div>
  </div>
</body>
</html>
    `;
  }

  /**
   * Генерация чека из заказа
   */
  static async generateReceiptFromOrder(orderId: string, format: 'text' | 'html' = 'text'): Promise<string> {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
        payment: true,
        user: true,
      },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    const receiptData: ReceiptData = {
      orderId: order.id,
      orderNumber: order.orderNumber || order.id,
      createdAt: order.createdAt,
      items: order.items.map((item) => ({
        productName: item.product.name,
        variantName: item.variant.name,
        quantity: item.quantity,
        price: Number(item.price),
      })),
      totalAmount: Number(order.finalAmount),
      currency: order.currency,
      paymentMethod: order.payment?.provider || 'Не указано',
      paymentStatus: order.payment?.status || 'Не указано',
      customerInfo: {
        name: `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim(),
        email: order.orderData.email,
        phone: order.orderData.phone,
      },
    };

    if (format === 'html') {
      return this.generateHTMLReceipt(receiptData);
    }

    return this.generateTextReceipt(receiptData);
  }

  /**
   * Сохранение чека в БД
   */
  static async saveReceipt(orderId: string, content: string, format: 'text' | 'html'): Promise<void> {
    await prisma.order.update({
      where: { id: orderId },
      data: {
        receipt: content,
        receiptFormat: format,
      },
    });
  }

  /**
   * Получение чека заказа
   */
  static async getReceipt(orderId: string): Promise<{ content: string; format: string } | null> {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { receipt: true, receiptFormat: true },
    });

    if (!order || !order.receipt) {
      return null;
    }

    return {
      content: order.receipt,
      format: order.receiptFormat || 'text',
    };
  }
}
