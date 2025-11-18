"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();

  function goBack() {
    try {
      router.back();
    } catch {
      router.push('/');
    }
  }

  return (
    <button type="button" onClick={goBack} className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-4">
      <ChevronLeft size={16} />
      Back
    </button>
  );
}
