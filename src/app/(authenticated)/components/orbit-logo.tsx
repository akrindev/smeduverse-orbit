// this is a component to display the Orbit logo
// it is used in the header
"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export function OrbitLogo({ className }: { className?: string }) {
  return (
    <Link href={"/"} className="cursor-pointer">
      <div className={cn("flex items-center", className)}>
        <Image src="/orbit.png" width={30} height={30} alt="Smeduverse Orbit" />
        <span className="ml-2 lg:ml-5 text-xl font-bold">Smeduverse Orbit</span>
      </div>
    </Link>
  );
}
