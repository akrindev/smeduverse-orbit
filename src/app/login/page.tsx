import { Metadata } from "next";
import Image from "next/image";

import { UserAuthForm } from "./components/user-auth-form";

export const metadata: Metadata = {
  title: "Login Smeduverse Orbit",
  description: "Login to your Smeduverse account",
};

export default function AuthenticationPage() {
  return (
    <>
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
                Sebelum melangkah lebih jauh, Identifikasi diri kamu dulu yuk ✨
              </p>
            </div>
            <UserAuthForm />
            <p className="mt-5 px-8 text-center text-sm text-muted-foreground">
              <strong>"Smeduverse Orbit"</strong> {" by"} Smeducative. <br />{" "}
              Part of SMK Diponegoro Karanganyar Kab. Pekalongan
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
