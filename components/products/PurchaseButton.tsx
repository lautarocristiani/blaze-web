"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";

export function PurchaseButton({ productId }: { productId: string }) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePurchase = async () => {
    setIsLoading(true);
    // Próximo paso: Aquí llamaremos a la Server Action de Stripe
    console.log("Comprando producto:", productId);
    alert("Próximo paso: Conectar con Stripe!");
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