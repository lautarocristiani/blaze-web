"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Monitor } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { setTheme as saveThemeToDb } from "@/lib/actions";

export function ThemeToggle({ savedTheme }: { savedTheme?: string | null }) {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, [savedTheme, setTheme]);

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    const formData = new FormData();
    formData.append("theme", newTheme);
    saveThemeToDb(formData);
  };

  const renderIcon = () => {
    if (!mounted) return <Sun className="h-[1.2rem] w-[1.2rem] opacity-50" />;

    if (theme === "system") {
      return <Monitor className="h-[1.2rem] w-[1.2rem]" />;
    }
    if (theme === "dark") {
      return <Moon className="h-[1.2rem] w-[1.2rem]" />;
    }
    return <Sun className="h-[1.2rem] w-[1.2rem]" />;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          {renderIcon()}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleThemeChange("light")}>
          <Sun className="mr-2 h-4 w-4" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange("system")}>
          <Monitor className="mr-2 h-4 w-4" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}