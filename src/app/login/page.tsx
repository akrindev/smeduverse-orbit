import { Metadata } from "next";
import Image from "next/image";
import OrbitImg from "public/orbit.png";

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
            <div className="mb-10 flex flex-col space-y-5 text-center">
              {/* add smeduverse orbit logo */}
              <div className="mx-auto flex items-center">
                <Image
                  src={OrbitImg}
                  alt="Smeduverse Orbit Logo"
                  width={30}
                  height={30}
                  className="mr-3"
                />
                <h1 className="text-2xl font-semibold tracking-tight">
                  Smeduverse Orbit
                </h1>
              </div>
              <p className="text-sm text-muted-foreground">
                Sebelum melangkah lebih jauh, <br /> Identifikasi diri kamu dulu
                yuk ✨
              </p>
            </div>
            <UserAuthForm />
            <p className="mt-10 px-8 text-center text-sm text-muted-foreground">
              <strong>"Smeduverse Orbit"</strong> {" by"} <br /> SMK Diponegoro
              Karanganyar Kab. Pekalongan
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
