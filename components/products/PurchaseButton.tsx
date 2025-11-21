"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart, Loader2, CreditCard } from "lucide-react";
import { useState } from "react";
import { checkoutProduct } from "@/lib/actions";
import { useCart } from "@/context/CartContext";
import { Product } from "./ProductCard";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface PurchaseButtonProps {
  product: Product;
}

export function PurchaseButton({ product }: PurchaseButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { addToCart, removeFromCart, cart } = useCart();
  const router = useRouter();

  const isInCart = cart.some((p) => p.id === product.id);

  const handlePurchase = async () => {
    try {
      setIsLoading(true);
      // Recibimos la URL en lugar de que el server redireccione
      const response = await checkoutProduct(product.id);
      if (response && response.url) {
        router.push(response.url);
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Could not initiate checkout.");
      setIsLoading(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`, {
      description: "You can view it in your shopping cart.",
      action: {
        label: "Undo",
        onClick: () => removeFromCart(product.id),
      },
    });
  };

  return (
    <div className="flex gap-3 w-full">
      <Button 
        variant="outline"
        size="lg" 
        className="flex-1 transition-all active:scale-95" 
        onClick={handleAddToCart}
        disabled={isInCart || product.is_sold}
      >
        <ShoppingCart className="mr-2 h-5 w-5" />
        {isInCart ? "In Cart" : "Add to Cart"}
      </Button>

      <Button 
        size="lg" 
        className="flex-1 font-bold shadow-md transition-all active:scale-95" 
        onClick={handlePurchase} 
        disabled={isLoading || product.is_sold}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-5 w-5" />
            Buy Now
          </>
        )}
      </Button>
    </div>
  );
}