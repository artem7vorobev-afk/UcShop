export interface DeliveryProvider {
  name: string;
  
  /**
   * Доставка товара
   * @param orderItem Позиция заказа
   * @param deliveryData Данные для доставки (ID пользователя, email и т.д.)
   */
  deliverProduct(
    orderItem: OrderItemData,
    deliveryData: DeliveryData
  ): Promise<DeliveryResult>;

  /**
   * Проверка статуса доставки
   * @param deliveryId ID доставки
   */
  checkDeliveryStatus(deliveryId: string): Promise<DeliveryStatusResult>;

  /**
   * Отмена доставки
   * @param deliveryId ID доставки
   */
  cancelDelivery(deliveryId: string): Promise<CancellationResult>;
}

export interface OrderItemData {
  productId: string;
  productName: string;
  variantId: string;
  variantName: string;
  quantity: number;
  itemData: Record<string, any>;
}

export interface DeliveryData {
  userId: string;
  telegramId?: string;
  email?: string;
  phone?: string;
  customData?: Record<string, any>;
}

export interface DeliveryResult {
  success: boolean;
  deliveryId?: string;
  deliveryDetails?: DeliveryDetails;
  error?: string;
  providerData?: Record<string, any>;
}

export interface DeliveryDetails {
  type: 'CODE' | 'KEY' | 'ACCOUNT' | 'GIFT_CARD' | 'TOP_UP';
  content: string;
  instructions?: string;
  expiryDate?: Date;
}

export interface DeliveryStatusResult {
  success: boolean;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  deliveryDetails?: DeliveryDetails;
  error?: string;
}

export interface CancellationResult {
  success: boolean;
  error?: string;
}
