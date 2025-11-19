import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { ProductGallery } from "@/components/products/ProductGallery";
import { PurchaseButton } from "@/components/products/PurchaseButton";
import { Button } from "@/components/ui/button";
import { deleteProduct } from "@/lib/actions";
import { getProductById, hasUserBoughtProduct } from "@/lib/data";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
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
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;

  const isOwner = userId === product.seller_id;

  let hasBought = false;
  if (userId) {
    hasBought = await hasUserBoughtProduct(userId, id);
  }

  const showPurchaseButton = !isOwner && !hasBought && !product.is_sold;

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

            <div className="mt-4 flex items-center space-x-3">
              <Avatar className="h-10 w-10 border">
                <AvatarImage src={product.sellerAvatar || ""} alt={product.sellerName} />
                <AvatarFallback>{product.sellerName.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm text-muted-foreground">Sold by</p>
                <p className="font-medium text-primary">@{product.sellerName}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2 border-t border-b py-4">
            <p className="text-4xl font-bold">{formatPrice(product.price)}</p>
          </div>

          <div>
            <h3 className="mb-2 text-lg font-semibold">Description</h3>
            <div className="prose dark:prose-invert max-w-none text-muted-foreground">
              <p className="whitespace-pre-line">{product.description}</p>
            </div>
          </div>

          <div className="pt-4">
            {isOwner && !product.is_sold ? (
              <div className="grid grid-cols-2 gap-4">
                <Button asChild size="lg" variant="outline">
                  <Link href={`/products/${product.id}/edit`}>
                    <Pencil className="mr-2 h-5 w-5" />
                    Edit Product
                  </Link>
                </Button>
                <DeleteButton productId={product.id} />
              </div>
            ) : isOwner && product.is_sold ? (
              <Button variant="secondary" size="lg" className="w-full" disabled>
                Product Sold
              </Button>
            ) : showPurchaseButton ? (
              <PurchaseButton productId={product.id} />
            ) : hasBought ? (
              <Button variant="secondary" size="lg" className="w-full" disabled>
                Already Purchased
              </Button>
            ) : (
              <Button variant="secondary" size="lg" className="w-full" disabled>
                Product Sold
              </Button>
            )}
          </div>
        </div>
      </div>
      {product.is_sold && !isOwner && !hasBought && (
        <div className="mt-8 rounded-lg bg-yellow-100 p-4 text-sm text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
          This item has already been sold.
        </div>
      )}
    </div>
  );
}