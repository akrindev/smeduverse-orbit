"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Image from "next/image";
import { useEffect } from "react";

export default function Page() {
  const { data, status } = useSession();

  useEffect(() => {
    // if not authenticated
    if (status === "unauthenticated") {
      redirect("/login");
    }

    // if authenticated
    redirect("/dashboard");
  }, [status]);

  return (
    <div className="container relative h-screen flex-col items-center justify-center grid lg:px-0">
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center sm:w-[400px]">
          <div className="mb-5 flex flex-col space-y-2 text-center">
            {/* add smeduverse orbit logo */}
            <div className="mx-auto flex items-center space-x-3">
              <Image
                src="/orbit.png"
                alt="Smeduverse Orbit Logo"
                width={50}
                height={40}
              />
              <h1 className="text-2xl font-semibold tracking-tight">
                Smeduverse Orbit
              </h1>
            </div>
            <p className="text-sm text-muted-foreground">
              {/* penjelasan SMeduverse orbit */}
              Smeduverse Orbit adalah sebuah platform yang dibuat untuk
              memudahkan guru dalam mengelola pembelajaran secara Digital.
            </p>
          </div>
          <p className="mt-5 px-8 text-center text-sm text-muted-foreground">
            <strong>"Smeduverse Orbit"</strong> {" by"} Smeducative. <br /> Part
            of SMK Diponegoro Karanganyar Kab. Pekalongan
          </p>
        </div>
      </div>
    </div>
  );
}
