"use client";

import Image from "next/image";
import OrbitImg from "public/orbit.png";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/store/useAuth";

import { UserAuthForm } from "./components/user-auth-form";

export default function AuthenticationPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Redirect if user is already authenticated
  useEffect(() => {
    // Only redirect if authentication state is fully determined (not loading)
    // and user is authenticated
    if (!isLoading && isAuthenticated) {
      const from = searchParams.get("from") || "/dashboard";

      // Use Next.js router instead of window.location to prevent refresh and potential loops
      router.push(from);
    }
  }, [isAuthenticated, searchParams, router, isLoading]);

  return (
    <>
      <div className="relative flex-col justify-center items-center grid lg:px-0 h-screen container">
        <div className="lg:p-8">
          <div className="flex flex-col justify-center mx-auto w-full sm:w-[400px]">
            <div className="flex flex-col space-y-5 mb-10 text-center">
              {/* add smeduverse orbit logo */}
              <div className="flex items-center mx-auto">
                <Image
                  src={OrbitImg}
                  alt="Smeduverse Orbit Logo"
                  width={30}
                  height={30}
                  className="mr-3"
                />
                <h1 className="font-semibold text-2xl tracking-tight">
                  Smeduverse Orbit
                </h1>
              </div>
              <p className="text-muted-foreground text-sm">
                Sebelum melangkah lebih jauh, <br /> Identifikasi diri kamu dulu
                yuk ✨
              </p>
            </div>
            <UserAuthForm />
            <p className="mt-10 px-8 text-muted-foreground text-sm text-center">
              <strong>"Smeduverse Orbit"</strong> {" by"} <br /> SMK Diponegoro
              Karanganyar Kab. Pekalongan
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
