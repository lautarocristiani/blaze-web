import Link from "next/link";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

export default function CanceledPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
        <XCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
      </div>
      <h1 className="mb-2 text-3xl font-bold">Payment Canceled</h1>
      <p className="mb-8 text-muted-foreground">
        You have canceled the checkout process. No charges were made.
      </p>
      <Button asChild variant="secondary">
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  );
}