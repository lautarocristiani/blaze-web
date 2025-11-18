import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProductForm } from "@/components/products/ProductForm";

export default async function SellPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/auth");
  }

  return (
    <div className="container mx-auto max-w-screen-md px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Sell Your Item</h1>
      <ProductForm />
    </div>
  );
}