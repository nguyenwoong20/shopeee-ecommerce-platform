import client, { getSessionId } from './client';
import type { CartSummary } from '../types';

export const getCart = () =>
  client.get<CartSummary>(`/cart/${getSessionId()}`).then(r => r.data);

export const getCartCount = () =>
  client.get<{ count: number }>(`/cart/${getSessionId()}/count`).then(r => r.data.count);

export const addToCart = (productId: number, quantity = 1) =>
  client.post<CartSummary>('/cart/add', { productId, quantity, sessionId: getSessionId() }).then(r => r.data);

export const updateQty = (itemId: number, quantity: number) =>
  client.patch<CartSummary>(`/cart/${getSessionId()}/items/${itemId}`, null, { params: { quantity } }).then(r => r.data);

export const removeFromCart = (itemId: number) =>
  client.delete<CartSummary>(`/cart/${getSessionId()}/items/${itemId}`).then(r => r.data);

export const clearCart = () =>
  client.delete(`/cart/${getSessionId()}/clear`);
