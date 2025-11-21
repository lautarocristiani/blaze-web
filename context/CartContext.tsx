"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { Product } from "@/components/products/ProductCard";

interface CartContextType {
  cart: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Product[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. Cargar
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("blaze-cart");
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (e) {
          console.error("Error loading cart", e);
        }
      }
      setIsLoaded(true);
    }
  }, []);

  // 2. Guardar
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("blaze-cart", JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  const addToCart = useCallback((product: Product) => {
    setCart((prev) => {
      if (prev.some((p) => p.id === product.id)) return prev;
      return [...prev, product];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((p) => p.id !== productId));
  }, []);

  // CORRECCIÓN CLAVE: Usamos el callback de setState para verificar el estado anterior
  const clearCart = useCallback(() => {
    setCart((prev) => {
      // Si ya está vacío, retornamos el mismo estado (evita re-render)
      if (prev.length === 0) return prev;
      return [];
    });
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        cartCount: cart.length,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}