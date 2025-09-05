"use client";

import { useTheme } from "next-themes";
import { Icons } from "./icons";
import { Button } from "./ui/button";

export default function ThemeSwitcher() {
	const { theme, setTheme } = useTheme();

	return (
		<Button
			variant={"ghost"}
			size={"sm"}
			onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
		>
			<Icons.sun className="w-5 h-5 rotate-0 dark:-rotate-90 scale-100 dark:scale-0 transition-all" />
			<Icons.moon className="absolute w-5 h-5 rotate-90 dark:rotate-0 scale-0 dark:scale-100 transition-all" />

			<span className="sr-only">Toggle theme</span>
		</Button>
	);
}
