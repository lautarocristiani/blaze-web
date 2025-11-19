"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart, Loader2 } from "lucide-react";
import { useState } from "react";
import { checkoutProduct } from "@/lib/actions";

export function PurchaseButton({ productId }: { productId: string }) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePurchase = async () => {
    try {
      setIsLoading(true);
      await checkoutProduct(productId);
    } catch (error) {
      console.error(error);
      alert("Something went wrong or product is sold."); 
      setIsLoading(false);
    }
  };

  return (
    <Button size="lg" className="w-full" onClick={handlePurchase} disabled={isLoading}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <ShoppingCart className="mr-2 h-5 w-5" />
          Buy Now
        </>
      )}
    </Button>
  );
}