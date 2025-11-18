import Link from "next/link";
import { Button } from "@/components/ui/button";
import UserMenu from "@/components/ui/UserMenu";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { createClient } from "@/lib/supabase/server";

export async function Header() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user ?? null;

  let username: string | null = null;
  let avatarUrl: string | null = null;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("username, avatar_url")
      .eq("id", user.id)
      .single();

    username = profile?.username ?? user.email ?? null;
    avatarUrl = profile?.avatar_url ? profile.avatar_url : null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 max-w-screen-2xl items-center px-4">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="font-bold sm:inline-block">Blaze</span>
        </Link>

        <nav className="flex flex-1 items-center space-x-6 text-sm font-medium"></nav>

        <div className="flex items-center justify-end space-x-2">
          <ThemeToggle />

          {user ? (
            <>
              <Button asChild variant="secondary" size="sm">
                <Link href="/sell">Sell an Item</Link>
              </Button>
              <UserMenu username={username} avatarUrl={avatarUrl} />
            </>
          ) : (
            <Button asChild>
              <Link href="/auth">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}