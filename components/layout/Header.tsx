import Link from "next/link";
import { Button } from "@/components/ui/button";
import UserMenu from "@/components/ui/UserMenu";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { createClient } from "@/lib/supabase/server";
import { Flame, Plus, LogIn } from "lucide-react";
import { SearchInput } from "@/components/ui/SearchInput";

export async function Header() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user ?? null;

  let username: string | null = null;
  let avatarUrl: string | null = null;
  let savedTheme: string | null = null;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("username, avatar_url, theme")
      .eq("id", user.id)
      .single();

    username = profile?.username ?? user.email ?? null;
    avatarUrl = profile?.avatar_url ? profile.avatar_url : null;
    savedTheme = profile?.theme ?? null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 max-w-screen-2xl items-center px-4 gap-4">
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20 transition-transform group-hover:scale-105">
            <Flame className="h-5 w-5 text-primary fill-primary/20" />
          </div>
          <span className="font-extrabold text-xl tracking-tighter bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent hidden sm:inline-block">
            Blaze
          </span>
        </Link>

        <div className="flex-1 flex justify-center">
           <SearchInput />
        </div>

        <div className="flex items-center justify-end space-x-2">
          <ThemeToggle savedTheme={savedTheme} />

          {user ? (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden sm:flex font-bold">
                <Link href="/sell">
                  <Plus className="mr-2 h-4 w-4" />
                  Sell Item
                </Link>
              </Button>
              <Button asChild variant="ghost" size="icon" className="sm:hidden">
                <Link href="/sell">
                  <Plus className="h-5 w-5" />
                </Link>
              </Button>

              <UserMenu username={username} avatarUrl={avatarUrl} />
            </>
          ) : (
            <Button asChild variant="ghost" size="sm">
              <Link href="/auth">
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}