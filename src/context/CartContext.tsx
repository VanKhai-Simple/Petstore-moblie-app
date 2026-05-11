import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { cartService } from '../api/cartService';
import { useAppContext } from './AppContext';

type Product = any;

interface CartLine {
  id?: number | string;
  cartId?: number;
  product: Product;
  quantity: number;
}

interface CartContextValue {
  lines: CartLine[];
  itemCount: number;
  subtotal: number;
  isSyncing: boolean;
  syncError: string | null;
  refreshCart: () => Promise<void>;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

const getCartErrorMessage = (error: any, fallback: string) => {
  if (error?.status === 401 || error?.status === 403) {
    return 'Vui lòng đăng nhập lại để đồng bộ giỏ hàng.';
  }

  return error?.message ?? fallback;
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const { token } = useAppContext();

  const refreshCart = useCallback(async () => {
    if (!token) {
      setLines([]);
      setSyncError(null);
      return;
    }

    setIsSyncing(true);
    try {
      const serverLines = await cartService.getMyCartLines();
      setLines(serverLines);
      setSyncError(null);
    } catch (error: any) {
      setSyncError(error?.message ?? 'Unable to sync cart.');
    } finally {
      setIsSyncing(false);
    }
  }, [token]);

  useEffect(() => {
    let mounted = true;

    const loadServerCart = async () => {
      if (!token) {
        setLines([]);
        setSyncError(null);
        return;
      }

      setIsSyncing(true);
      try {
        const serverLines = await cartService.getMyCartLines();
        if (mounted) {
          setLines(serverLines);
          setSyncError(null);
        }
      } catch (error: any) {
        if (mounted) {
          setSyncError(error?.message ?? 'Unable to sync cart.');
        }
      } finally {
        if (mounted) {
          setIsSyncing(false);
        }
      }
    };

    loadServerCart();

    return () => {
      mounted = false;
    };
  }, [token]);

  const value = useMemo<CartContextValue>(() => {
    const subtotal = lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
    const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);

    return {
      lines,
      subtotal,
      itemCount,
      isSyncing,
      syncError,
      refreshCart,
      async addToCart(product, quantity = 1) {
        if (!token) {
          setSyncError('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.');
          return;
        }

        setIsSyncing(true);
        try {
          await cartService.addToCart(product.id, quantity);
          await refreshCart();
          setSyncError(null);
        } catch (error: any) {
          setSyncError(getCartErrorMessage(error, 'Không thêm được sản phẩm vào giỏ hàng.'));
        } finally {
          setIsSyncing(false);
        }
      },
      async removeFromCart(productId) {
        const previousLines = lines;

        if (!token) {
          setSyncError('Vui lòng đăng nhập để cập nhật giỏ hàng.');
          return;
        }

        setLines((current) => current.filter((line) => line.product.id !== productId));
        setIsSyncing(true);
        try {
          await cartService.removeItem(productId);
          await refreshCart();
          setSyncError(null);
        } catch (error: any) {
          setLines(previousLines);
          setSyncError(getCartErrorMessage(error, 'Không xóa được sản phẩm khỏi giỏ hàng.'));
        } finally {
          setIsSyncing(false);
        }
      },
      async updateQuantity(productId, quantity) {
        const nextQuantity = Math.max(1, quantity);
        const previousLines = lines;

        if (!token) {
          setSyncError('Vui lòng đăng nhập để cập nhật giỏ hàng.');
          return;
        }

        setLines((current) =>
          current.map((line) => (line.product.id === productId ? { ...line, quantity: nextQuantity } : line))
        );
        setIsSyncing(true);
        try {
          await cartService.updateQuantity(productId, nextQuantity);
          await refreshCart();
          setSyncError(null);
        } catch (error: any) {
          setLines(previousLines);
          setSyncError(getCartErrorMessage(error, 'Không cập nhật được số lượng giỏ hàng.'));
        } finally {
          setIsSyncing(false);
        }
      }
    };
  }, [isSyncing, lines, refreshCart, syncError, token]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used inside CartProvider');
  }
  return context;
};
