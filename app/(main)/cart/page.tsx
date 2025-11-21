"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { Trash2, CreditCard, ArrowRight } from "lucide-react";
import { checkoutCart } from "@/lib/actions";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const router = useRouter();

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      const productIds = cart.map((p) => p.id);
      const response = await checkoutCart(productIds);
      
      if (response && response.url) {
        router.push(response.url);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Checkout failed. Please try again.");
      setIsCheckingOut(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto max-w-screen-lg px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-8">Looks like you haven't added anything yet.</p>
        <Button asChild>
          <Link href="/">Browse Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-screen-xl px-4 py-10">
      <div className="flex items-center justify-between mb-8">
         <h1 className="text-3xl font-bold">Shopping Cart ({cart.length})</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4 flex gap-4 items-center">
                <div className="relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                  <Image
                    src={item.image_url || "/placeholder.svg"}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold line-clamp-1">
                    <Link href={`/products/${item.id}`} className="hover:underline">
                        {item.name}
                    </Link>
                  </h3>
                  <p className="text-sm text-muted-foreground">Sold by @{item.sellerName || "Unknown"}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold mb-2">{formatPrice(item.price)}</p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          <Button variant="outline" onClick={clearCart} className="mt-4">
            Clear Cart
          </Button>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardContent className="p-6 space-y-6">
              <h2 className="text-xl font-bold">Order Summary</h2>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Taxes</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>
              
              <div className="border-t pt-4 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>

              <Button 
                className="w-full" 
                size="lg" 
                onClick={handleCheckout}
                disabled={isCheckingOut}
              >
                {isCheckingOut ? "Processing..." : (
                    <>
                        Checkout <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}