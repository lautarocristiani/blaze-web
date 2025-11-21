"use client";

import { ThemeProvider } from "next-themes";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "@/components/ui/sonner"; 

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <CartProvider>
        {children}
        <Toaster position="bottom-right" richColors />
      </CartProvider>
    </ThemeProvider>
  );
}