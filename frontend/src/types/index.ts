// ─── Domain Types — E-Commerce Platform ─────────────────────────────────────

export interface Category {
  readonly id: number;
  readonly name: string;
  readonly icon: string;
  readonly slug: string;
  readonly sortOrder: number;
}

export interface Product {
  readonly id: number;
  readonly name: string;
  readonly description?: string;
  readonly price: number;
  readonly originalPrice?: number;
  readonly discountPercent?: number;
  readonly stock?: number;
  readonly sold: number;
  readonly rating: number;
  readonly reviewCount: number;
  readonly imageUrl: string;
  readonly imageUrls?: string;
  readonly categoryName?: string;
  readonly categoryId?: number;
  readonly brand?: string;
  readonly featured?: boolean;
  readonly flashSale?: boolean;
  readonly flashSalePrice?: number;
  readonly flashSaleEnd?: string;
}

export interface CartItem {
  readonly id: number;
  readonly sessionId: string;
  readonly productId: number;
  readonly productName: string;
  readonly productImage: string;
  readonly productPrice: number;
  quantity: number;
  readonly addedAt: string;
}

export interface CartSummary {
  readonly items: CartItem[];
  readonly totalItems: number;
  readonly subtotal: number;
  readonly shipping: number;
  readonly total: number;
}

export type PaymentMethod = 'COD' | 'VNPAY' | 'MOMO';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPING' | 'DELIVERED' | 'CANCELLED';

export interface OrderItem {
  readonly id: number;
  readonly productId: number;
  readonly productName: string;
  readonly productImage?: string;
  readonly unitPrice: number;
  readonly quantity: number;
  readonly lineTotal: number;
}

export interface Order {
  readonly id: number;
  readonly orderCode: string;
  readonly customerName: string;
  readonly customerPhone: string;
  readonly shippingAddress: string;
  readonly shippingCity: string;
  readonly items: OrderItem[];
  readonly subtotal: number;
  readonly shippingFee: number;
  readonly total: number;
  readonly paymentMethod: PaymentMethod;
  readonly paymentStatus: PaymentStatus;
  readonly orderStatus: OrderStatus;
  readonly paymentUrl?: string;
  readonly notes?: string;
  readonly createdAt: string;
}

export interface CheckoutPayload {
  sessionId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  shippingAddress: string;
  shippingCity: string;
  shippingDistrict?: string;
  shippingWard?: string;
  notes?: string;
  paymentMethod: PaymentMethod;
}

export interface PagedResponse<T> {
  readonly content: T[];
  readonly page: number;
  readonly size: number;
  readonly totalElements: number;
  readonly totalPages: number;
  readonly last: boolean;
}

export type ApiResult<T> =
  | { kind: 'ok'; data: T }
  | { kind: 'err'; message: string };
