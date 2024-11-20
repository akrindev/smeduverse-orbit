"use client";

import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { Icons } from "./icons";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant={"ghost"}
      size={"sm"}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      <Icons.sun className='w-5 h-5 transition-all rotate-0 scale-100 dark:-rotate-90 dark:scale-0' />
      <Icons.moon className='absolute w-5 h-5 transition-all rotate-90 scale-0 dark:rotate-0 dark:scale-100' />

      <span className='sr-only'>Toggle theme</span>
    </Button>
  );
}
