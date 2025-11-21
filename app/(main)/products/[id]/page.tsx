import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ArrowLeft, 
  ShieldCheck, 
  Truck, 
  Calendar,
  AlertCircle
} from "lucide-react";
import { PurchaseButton } from "@/components/products/PurchaseButton";
import { Product } from "@/components/products/ProductCard";

export const revalidate = 0;

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  const { data: productData } = await supabase
    .from("products")
    .select(`
      *,
      profiles:seller_id (
        username,
        avatar_url,
        first_name,
        last_name
      )
    `)
    .eq("id", id)
    .single();

  if (!productData) {
    notFound();
  }

  // Casteamos el perfil del vendedor
  const seller = productData.profiles as any;
  const isOwner = userData.user?.id === productData.seller_id;
  const isSold = productData.is_sold;

  // Construimos el objeto producto asegurándonos que cumpla con la interfaz Product
  const product: Product = {
    id: productData.id,
    name: productData.name,
    price: productData.price,
    image_url: productData.image_url,
    description: productData.description,
    is_sold: productData.is_sold,
    sellerName: seller?.username ?? "Unknown"
  };

  return (
    <div className="container mx-auto max-w-screen-xl px-4 py-8 animate-in fade-in duration-500">
      <Button variant="ghost" size="sm" asChild className="mb-6 -ml-2 text-muted-foreground">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Marketplace
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Columna Izquierda: Imagen */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-xl border bg-muted shadow-sm">
            <Image
              src={product.image_url || "/placeholder.svg"}
              alt={product.name}
              fill
              className={`object-cover ${isSold ? "grayscale opacity-90" : ""}`}
              priority
            />
            {isSold && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                <div className="rotate-[-12deg] border-4 border-white px-8 py-2 text-4xl font-black uppercase tracking-widest text-white shadow-2xl opacity-90">
                  Sold Out
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Columna Derecha: Detalles */}
        <div className="flex flex-col space-y-8">
          <div>
            <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="capitalize">
                    {productData.category}
                </Badge>
                <span className="text-sm text-muted-foreground flex items-center">
                   <Calendar className="mr-1 h-3 w-3" />
                   Listed {new Date(productData.created_at).toLocaleDateString()}
                </span>
            </div>
            
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
              {product.name}
            </h1>
            
            <div className="flex items-baseline gap-4">
                <p className={`text-4xl font-bold ${isSold ? "text-muted-foreground line-through decoration-2" : "text-primary"}`}>
                {formatPrice(product.price)}
                </p>
                {isSold && (
                    <span className="text-xl font-semibold text-destructive uppercase tracking-wide border border-destructive px-3 py-1 rounded-md">
                        Sold
                    </span>
                )}
            </div>
          </div>

          {/* Tarjeta del Vendedor */}
          <div className="flex items-center gap-4 rounded-lg border p-4 bg-card/50 shadow-sm">
            <Avatar className="h-12 w-12 border">
              <AvatarImage src={seller?.avatar_url} />
              <AvatarFallback>{seller?.username?.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">Seller</p>
              <p className="font-bold text-lg">@{seller?.username}</p>
            </div>
            {!isOwner && (
                <Button variant="outline" size="sm">View Profile</Button>
            )}
          </div>

          {/* Descripción */}
          <div className="prose prose-stone dark:prose-invert max-w-none">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {product.description}
            </p>
          </div>

          {/* Botones de Acción */}
          <div className="pt-6 border-t space-y-6">
            {isSold ? (
               <div className="rounded-md bg-muted p-4 flex items-center gap-3 text-muted-foreground border border-border">
                  <AlertCircle className="h-5 w-5" />
                  <p className="text-sm font-medium">This item has been sold and is no longer available for purchase.</p>
               </div>
            ) : isOwner ? (
               <div className="flex gap-3">
                  <Button className="flex-1" variant="outline" asChild>
                    <Link href={`/products/${id}/edit`}>Edit Listing</Link>
                  </Button>
               </div>
            ) : (
               <PurchaseButton product={product} />
            )}
            
            {!isSold && (
                <div className="grid grid-cols-2 gap-4 text-center text-xs text-muted-foreground">
                    <div className="flex flex-col items-center gap-1 p-2 rounded bg-muted/30">
                        <ShieldCheck className="h-5 w-5 mb-1 text-primary" />
                        <span>Secure Payment via Stripe</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 p-2 rounded bg-muted/30">
                        <Truck className="h-5 w-5 mb-1 text-primary" />
                        <span>Instant Delivery (Simulated)</span>
                    </div>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}