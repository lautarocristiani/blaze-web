"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils"; // Usamos cn por si quieres pasar clases extra

export default function BackButton({ className }: { className?: string }) {
  const router = useRouter();

  function goBack() {
    try {
      router.back();
    } catch {
      router.push('/');
    }
  }

  return (
    <button 
      type="button" 
      onClick={goBack} 
      className={cn(
        "group inline-flex items-center gap-2 text-sm text-muted-foreground transition-all duration-200 ease-in-out hover:text-foreground hover:translate-x-[-4px]", 
        className
      )}
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/50 transition-colors group-hover:bg-primary/10 group-hover:text-primary">
        <ChevronLeft size={16} className="transition-transform" />
      </div>
      <span className="font-medium">Back</span>
    </button>
  );
}