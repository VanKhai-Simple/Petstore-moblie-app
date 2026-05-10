import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { products } from '../data/mockProducts';
import { cartService } from '../api/cartService';
import { useAppContext } from './AppContext';

type Product = any;

interface CartLine {
  product: Product;
  quantity: number;
}

interface CartContextValue {
  lines: CartLine[];
  itemCount: number;
  subtotal: number;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const initialLines: CartLine[] = [
  { product: products.find((product) => product.id === 6) ?? products[0], quantity: 1 },
  { product: products.find((product) => product.id === 7) ?? products[1], quantity: 1 }
];

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(initialLines);
  const { token } = useAppContext();

  useEffect(() => {
    let mounted = true;

    const loadServerCart = async () => {
      if (!token) {
        return;
      }

      try {
        const serverLines = await cartService.getMyCartLines();
        if (mounted && serverLines.length) {
          setLines(serverLines);
        }
      } catch {
        // Swagger does not define the error shape for MyCart; keep the local cart when the server rejects it.
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
      addToCart(product) {
        cartService.addToCart(product.id, 1).catch(() => {
          // Cart API requires a valid login token; local cart remains usable when the server rejects the request.
        });

        setLines((current) => {
          const existing = current.find((line) => line.product.id === product.id);
          if (existing) {
            return current.map((line) =>
              line.product.id === product.id ? { ...line, quantity: line.quantity + 1 } : line
            );
          }
          return [...current, { product, quantity: 1 }];
        });
      },
      removeFromCart(productId) {
        setLines((current) => current.filter((line) => line.product.id !== productId));
      },
      updateQuantity(productId, quantity) {
        setLines((current) =>
          current.map((line) => (line.product.id === productId ? { ...line, quantity: Math.max(1, quantity) } : line))
        );
      }
    };
  }, [lines]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used inside CartProvider');
  }
  return context;
};
