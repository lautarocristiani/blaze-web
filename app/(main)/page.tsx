import Link from "next/link";
import { getFilteredProducts } from "@/lib/data";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductFilters } from "@/components/products/ProductFilters";
import { Product } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PageProps = {
  searchParams: Promise<{
    page?: string;
    category?: string;
    sort?: string;
    search?: string;
  }>;
};

export const revalidate = 0;

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams;
  
  const page = Number(params.page) || 1;
  const filters = {
    page,
    category: params.category,
    sort: params.sort,
    search: params.search,
  };

  const { products, totalPages } = await getFilteredProducts(filters);

  return (
    <div className="container mx-auto max-w-screen-2xl px-4 py-8">
      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="w-full lg:w-64 lg:flex-shrink-0">
          <div className="sticky top-20">
            <ProductFilters />
          </div>
        </aside>

        <div className="flex-1">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Marketplace</h1>
            <p className="text-muted-foreground">
              Showing {products.length} results
            </p>
          </div>

          {products.length > 0 ? (
            <ProductGrid products={(products as Product[])} />
          ) : (
            <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
              <h3 className="text-lg font-semibold">No products found</h3>
              <p className="text-muted-foreground">Try adjusting your filters.</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              <Button
                variant="outline"
                disabled={page <= 1}
                asChild={page > 1}
              >
                {page > 1 ? (
                  <Link
                    href={{
                      query: { ...params, page: page - 1 },
                    }}
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                  </Link>
                ) : (
                  <span>
                    <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                  </span>
                )}
              </Button>

              <span className="flex items-center px-4 text-sm font-medium">
                Page {page} of {totalPages}
              </span>

              <Button
                variant="outline"
                disabled={page >= totalPages}
                asChild={page < totalPages}
              >
                {page < totalPages ? (
                  <Link
                    href={{
                      query: { ...params, page: page + 1 },
                    }}
                  >
                    Next <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                ) : (
                  <span>
                    Next <ChevronRight className="ml-2 h-4 w-4" />
                  </span>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}