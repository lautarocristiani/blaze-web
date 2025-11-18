"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";

export function PurchaseButton({ productId }: { productId: string }) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePurchase = async () => {
    setIsLoading(true);
    // Next step: Call Stripe Server Action here
    console.log("Purchasing product:", productId);
    alert("Next step: Connect with Stripe!");
    setIsLoading(false);
  };

  return (
    <Button size="lg" className="w-full" onClick={handlePurchase} disabled={isLoading}>
      {isLoading ? "Processing..." : (
        <>
          <ShoppingCart className="mr-2 h-5 w-5" />
          Buy Now
        </>
      )}
    </Button>
  );
}