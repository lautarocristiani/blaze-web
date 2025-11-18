import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";

// Esta 'interface' define qué datos espera el ProductCard
export interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.id}`}>
      <Card className="overflow-hidden transition-shadow duration-300 hover:shadow-lg">
        <CardContent className="p-0">
          <div className="relative aspect-square w-full">
            <Image
              src={product.image_url || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </CardContent>
        <CardFooter className="flex-col items-start p-4">
          <h3 className="truncate text-lg font-semibold">{product.name}</h3>
          <p className="text-xl font-bold">{formatPrice(product.price)}</p>
        </CardFooter>
      </Card>
    </Link>
  );
}