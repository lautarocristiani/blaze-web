import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { ProductGallery } from "@/components/products/ProductGallery";
import { PurchaseButton } from "@/components/products/PurchaseButton";
import { Button } from "@/components/ui/button";
import { deleteProduct } from "@/lib/actions";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";

type PageProps = {
  params: {
    id: string;
  };
};

async function DeleteButton({ productId }: { productId: string }) {
  const deleteAction = deleteProduct.bind(null, productId);
  return (
    <form action={deleteAction}>
      <Button variant="destructive" size="lg" className="w-full">
        <Trash2 className="mr-2 h-5 w-5" />
        Delete Product
      </Button>
    </form>
  );
}

export default async function ProductDetailPage({ params }: PageProps) {
  const supabase = await createClient();
  const { id } = params;

  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;

  const { data: product, error } = await supabase
    .from("products")
    .select(
      `
      id,
      name,
      description,
      price,
      image_url,
      seller_id,
      profiles ( username )
    `
    )
    .eq("id", id)
    .single();

  if (error || !product) {
    notFound();
  }

  const sellerUsername = product.profiles[0]?.username ?? "Unknown Seller";
  const isOwner = userId === product.seller_id;

  return (
    <div className="container mx-auto max-w-screen-lg px-4 py-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <ProductGallery
            productName={product.name}
            imageUrl={product.image_url ?? ""}
          />
        </div>

        <div className="flex flex-col space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {product.name}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sold by:{" "}
              <span className="font-medium text-primary">
                {sellerUsername}
              </span>
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-4xl font-bold">{formatPrice(product.price)}</p>
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <p>{product.description}</p>
          </div>

          <div className="pt-4">
            {isOwner ? (
              <div className="grid grid-cols-2 gap-4">
                <Button asChild size="lg" variant="outline">
                  <Link href={`/products/${product.id}/edit`}>
                    <Pencil className="mr-2 h-5 w-5" />
                    Edit Product
                  </Link>
                </Button>
                <DeleteButton productId={product.id} />
              </div>
            ) : (
              <PurchaseButton productId={product.id} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}