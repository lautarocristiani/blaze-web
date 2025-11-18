import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { Eye } from "lucide-react";

export interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  description?: string;
  sellerName?: string;
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="group flex h-full flex-col overflow-hidden border-border/50 transition-all duration-300 hover:shadow-lg hover:border-primary/50">
      <Link href={`/products/${product.id}`} className="relative aspect-square w-full overflow-hidden bg-muted">
        <Image
          src={product.image_url || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading="eager"
        />
      </Link>

      <CardContent className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            {product.sellerName ? `@${product.sellerName}` : "Unknown Seller"}
          </span>
          <p className="font-bold text-lg text-primary">
            {formatPrice(product.price)}
          </p>
        </div>

        <Link href={`/products/${product.id}`} className="hover:underline decoration-primary underline-offset-4">
            <h3 className="line-clamp-1 text-lg font-semibold leading-tight mb-2">
            {product.name}
            </h3>
        </Link>
        
        <p className="line-clamp-2 text-sm text-muted-foreground mb-4 flex-1">
          {product.description || "No description available."}
        </p>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full gap-2" variant="secondary">
          <Link href={`/products/${product.id}`}>
            <Eye className="h-4 w-4" />
            View Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}