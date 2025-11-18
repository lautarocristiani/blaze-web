"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const categories = [
  "all",
  "Technology",
  "Clothing",
  "Sports",
  "Home & Garden",
  "Books",
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
    
    // Reset page to 1 when filtering
    params.set("page", "1");
    
    router.replace(`/?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 text-lg font-semibold">Categories</h3>
        <RadioGroup
          defaultValue={currentCategory}
          onValueChange={(val) => updateFilter("category", val)}
        >
          {categories.map((cat) => (
            <div key={cat} className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value={cat} id={cat} />
              <Label htmlFor={cat} className="capitalize cursor-pointer">
                {cat === "all" ? "All Categories" : cat}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Sort By</h3>
        <Select
          defaultValue={currentSort}
          onValueChange={(val) => updateFilter("sort", val)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
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