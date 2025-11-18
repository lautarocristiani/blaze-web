"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";

export function SearchInput() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [value, setValue] = useState(searchParams.get("search")?.toString() || "");

  useEffect(() => {
    setValue(searchParams.get("search")?.toString() || "");
  }, [searchParams]);

  function handleSearch() {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value.trim()) {
      params.set("search", value.trim());
    } else {
      params.delete("search");
    }
    
    params.set("page", "1");

    router.replace(`/?${params.toString()}`);
  }

  return (
    <div className="relative w-full max-w-sm">
      <button 
        onClick={handleSearch}
        className="absolute left-0 top-0 h-full px-3 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors z-10"
        aria-label="Search"
        type="button"
      >
        <Search className="h-4 w-4" />
      </button>
      
      <Input
        type="search"
        placeholder="Search products..."
        className="w-full bg-background pl-10 md:w-[300px] lg:w-[300px]"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
      />
    </div>
  );
}