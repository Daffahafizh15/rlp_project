import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CartData } from '../types';
import { cartApi } from '../services/api';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: CartData | null;
  cartCount: number;
  subtotal: number;
  isLoading: boolean;
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [cart, setCart] = useState<CartData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated || user?.role === 'ADMIN') {
      setCart(null);
      return;
    }

    try {
      setIsLoading(true);
      const res = await cartApi.getCart();
      setCart(res.data);
    } catch (e) {
      console.error('Failed to load cart', e);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user?.role]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addItem = async (variantId: string, quantity = 1) => {
    setIsLoading(true);
    try {
      const res = await cartApi.addItem(variantId, quantity);
      setCart(res.data);
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      const res = await cartApi.updateQuantity(itemId, quantity);
      setCart(res.data);
    } catch (e) {
      console.error('Failed to update quantity', e);
      throw e;
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      const res = await cartApi.removeItem(itemId);
      setCart(res.data);
    } catch (e) {
      console.error('Failed to remove item', e);
      throw e;
    }
  };

  const clearCart = async () => {
    try {
      const res = await cartApi.clearCart();
      setCart(res.data);
    } catch (e) {
      console.error('Failed to clear cart', e);
      throw e;
    }
  };

  const cartCount = cart?.totalItems || 0;
  const subtotal = cart?.subtotal || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        subtotal,
        isLoading,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
