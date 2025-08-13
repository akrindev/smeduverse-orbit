// this is a component to display the Orbit logo
// it is used in the header
"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function OrbitLogo({ className }: { className?: string }) {
	return (
		<Link href={"/"} className="cursor-pointer">
			<div className={cn("flex items-center", className)}>
				<Image src="/orbit.png" width={30} height={30} alt="Smeduverse Orbit" />
				<span className="ml-2 lg:ml-5 font-bold text-xl">Smeduverse Orbit</span>
			</div>
		</Link>
	);
}
