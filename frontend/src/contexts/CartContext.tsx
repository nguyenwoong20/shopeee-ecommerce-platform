import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { getCartCount, addToCart as apiAdd } from '../api/cart';

interface CartCtx {
  count: number;
  refreshCount: () => void;
  addToCart: (productId: number, qty?: number) => Promise<void>;
}

const CartContext = createContext<CartCtx>({ count: 0, refreshCount: () => {}, addToCart: async () => {} });

export function CartProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0);

  const refreshCount = useCallback(async () => {
    try { setCount(await getCartCount()); } catch { /* ignore */ }
  }, []);

  const addToCart = useCallback(async (productId: number, qty = 1) => {
    await apiAdd(productId, qty);
    await refreshCount();
  }, [refreshCount]);

  return <CartContext.Provider value={{ count, refreshCount, addToCart }}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
