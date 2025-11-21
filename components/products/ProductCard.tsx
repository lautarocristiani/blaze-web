import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  description?: string;
  sellerName?: string;
  is_sold?: boolean;
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.id}`} className="group block h-full">
      <Card className="relative h-full overflow-hidden border-border/60 bg-card transition-all duration-300 hover:shadow-md hover:border-primary/50">
        
        <div className="relative aspect-square w-full overflow-hidden bg-muted">
          <Image
            src={product.image_url || "/placeholder.svg"}
            alt={product.name}
            fill
            className={`object-cover transition-transform duration-500 group-hover:scale-105 ${product.is_sold ? "grayscale opacity-80" : ""}`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {product.is_sold && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                 <Badge variant="secondary" className="text-sm font-bold uppercase tracking-widest shadow-sm">
                    Sold
                 </Badge>
            </div>
          )}
        </div>

        <CardContent className="flex flex-col p-4 space-y-2">
          <div className="flex justify-between items-start gap-2">
            <h3 className="line-clamp-1 font-semibold leading-tight group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <p className={`font-bold text-lg whitespace-nowrap ${product.is_sold ? "text-muted-foreground line-through decoration-2" : "text-foreground"}`}>
              {formatPrice(product.price)}
            </p>
          </div>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
             <span className="flex items-center gap-1">
                by <span className="font-medium text-foreground/80">@{product.sellerName || "Unknown"}</span>
             </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}