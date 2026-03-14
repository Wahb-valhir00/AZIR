export interface Order {
  id: string;
  userId?: string;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: PaymentMethod;
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  status: OrderStatus;
  createdAt: Date;
  estimatedDelivery?: Date;
  trackingNumber?: string;
}

export interface OrderItem {
  productId: string;
  product: any; // Product type
  quantity: number;
  price: number;
  total: number;
}

export interface Address {
  firstName: string;
  lastName: string;
  company?: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

export interface PaymentMethod {
  type: 'card' | 'paypal' | 'cash';
  cardNumber?: string;
  cardName?: string;
  expiryDate?: string;
  cvv?: string;
  saveCard?: boolean;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface CheckoutData {
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: PaymentMethod;
  sameAsShipping: boolean;
  notes?: string;
}
