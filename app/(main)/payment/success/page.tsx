"use client";

import { Suspense, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, ShoppingBag } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";

function SuccessContent() {
  const searchParams = useSearchParams();
  const { clearCart, cart } = useCart();

  useEffect(() => {
    if (searchParams.get("clear_cart") === "true" && cart.length > 0) {
      clearCart();
    }
  }, [searchParams, clearCart, cart.length]);

  return (
    <div className="container mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 py-10 text-center">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
        <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
      </div>
      
      <h1 className="mb-2 text-3xl font-bold tracking-tight">Payment Successful!</h1>
      <p className="mb-8 text-muted-foreground">
        Thank you for your purchase. Your order has been processed successfully and the seller has been notified.
      </p>

      <div className="flex w-full flex-col gap-3 sm:flex-row">
        <Button asChild className="flex-1 font-semibold" size="lg">
          <Link href="/dashboard">
            <ShoppingBag className="mr-2 h-4 w-4" />
            View Orders
          </Link>
        </Button>
        <Button asChild variant="outline" className="flex-1" size="lg">
          <Link href="/">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center">Loading confirmation...</div>}>
      <SuccessContent />
    </Suspense>
  );
}