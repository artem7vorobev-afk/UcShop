export interface CreateOrderRequest {
  userId: string;
  items: Array<{
    variantId: string;
    quantity: number;
    itemData?: Record<string, any>;
  }>;
  orderData?: Record<string, any>;
}

export interface PaymentProviderResponse {
  success: boolean;
  paymentId?: string;
  paymentUrl?: string;
  error?: string;
}

export interface DeliveryProviderResponse {
  success: boolean;
  deliveryId?: string;
  error?: string;
}
