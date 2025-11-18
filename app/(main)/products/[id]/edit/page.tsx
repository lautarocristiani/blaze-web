import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/products/ProductForm";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditProductPage({ params }: PageProps) {
  const supabase = await createClient();
  const { id } = await params;

  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    redirect("/auth");
  }

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (!product) {
    notFound();
  }

  if (product.seller_id !== userData.user.id) {
    redirect(`/products/${id}`);
  }

  return (
    <div className="container mx-auto max-w-screen-md px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Edit Your Product</h1>
      <ProductForm product={product} />
    </div>
  );
}