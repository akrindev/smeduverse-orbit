import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: {
		default: "Smeduverse Orbit",
		template: "%s | Smeduverse Orbit",
	},
	description: "Smeduverse Orbit",
	// openGraph: {
	//   type: "website",
	//   locale: "en_US",
	//   images: [
	//     {
	//       url: `${process.env.NEXT_PUBLIC_BASE_URL}/orbit.png`,
	//       width: 1200,
	//       height: 630,
	//       alt: "Smeduverse Orbit",
	//     },
	//   ],
	// },
	creator: "Smeducative",
	icons: {
		icon: `${process.env.NEXT_PUBLIC_BASE_URL}/favicon-32x32.png`,
		apple: `${process.env.NEXT_PUBLIC_BASE_URL}/apple-touch-icon.png`,
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head />
			<body
				className={cn(
					"bg-background min-h-screen font-sans antialiased",
					inter.className,
				)}
				suppressHydrationWarning
			>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
					<Providers>{children}</Providers>
				</ThemeProvider>
				<Toaster />
			</body>
		</html>
	);
}
