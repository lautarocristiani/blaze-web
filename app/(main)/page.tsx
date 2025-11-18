import { createClient } from "@/lib/supabase/server";
import { ProductGrid } from "@/components/products/ProductGrid";
import { type Product } from "@/components/products/ProductCard";

export default async function HomePage() {
  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from("products")
    .select("id, name, price, image_url")
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    console.error("Error fetching products:", error);
  }

  return (
    <div className="container mx-auto max-w-screen-2xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">New Arrivals</h1>
      <ProductGrid products={(products as Product[]) ?? []} />
    </div>
  );
}