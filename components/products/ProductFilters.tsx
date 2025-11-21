"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ArrowUpDown } from "lucide-react";

const categories = [
  { id: "all", label: "All" },
  { id: "Technology", label: "Technology" },
  { id: "Clothing", label: "Clothing" },
  { id: "Sports", label: "Sports" },
  { id: "Home & Garden", label: "Home & Garden" },
  { id: "Books", label: "Books" },
];

export function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentCategory = searchParams.get("category") || "all";
  const currentSort = searchParams.get("sort") || "newest";

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value === "all" && key === "category") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    
    params.set("page", "1");
    
    router.replace(`/?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 text-lg font-semibold">Categories</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const isSelected = currentCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => updateFilter("category", cat.id)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all border",
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-background text-muted-foreground border-input hover:bg-accent hover:text-accent-foreground"
                )}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="pt-2">
        <Select
          defaultValue={currentSort}
          onValueChange={(val) => updateFilter("sort", val)}
        >
          <SelectTrigger className="w-full rounded-full border-input bg-background px-4 h-10">
            <div className="flex items-center gap-2 text-sm">
                <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-muted-foreground">Sort:</span>
                <SelectValue placeholder="Sort by" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest Arrivals</SelectItem>
            <SelectItem value="price_asc">Price: Low to High</SelectItem>
            <SelectItem value="price_desc">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}