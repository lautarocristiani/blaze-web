import { type NextRequest } from "next/server"
import { updateSession } from "@/lib/supabase/middleware"

// New Next.js convention: replace the old `middleware.ts` file with `proxy.ts`.
// This file mirrors the previous middleware behavior but follows the latest
// convention so Next.js won't show the deprecation warning.
export async function proxy(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
