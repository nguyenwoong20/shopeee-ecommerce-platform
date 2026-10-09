import client from './client';
import type { CheckoutPayload, Order } from '../types';

export const checkout = (payload: CheckoutPayload) =>
  client.post<Order>('/checkout', payload).then(r => r.data);

export const getOrderByCode = (code: string) =>
  client.get<Order>(`/orders/${code}`).then(r => r.data);

export const getOrdersByPhone = (phone: string) =>
  client.get<Order[]>('/orders', { params: { phone } }).then(r => r.data);

export const confirmPayment = (orderCode: string) =>
  client.post<Order>('/payment/confirm', { orderCode }).then(r => r.data);

export const cancelOrder = (id: number) =>
  client.patch<Order>(`/orders/${id}/cancel`).then(r => r.data);
