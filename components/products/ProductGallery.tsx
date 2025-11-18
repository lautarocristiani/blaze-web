"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

export function ProductGallery({
  productName,
  imageUrl,
}: {
  productName: string;
  imageUrl: string;
}) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="relative aspect-square w-full">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={productName}
            fill
            className="object-cover"
            priority={true}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="eager"
          />
        </div>
      </CardContent>
    </Card>
  );
}