"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconBrandGithub, IconLoader } from "@tabler/icons-react";
import { SignInResponse, getCsrfToken, signIn } from "next-auth/react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [csrfToken, setCsrfToken] = useState<string | undefined>("");

  const { toast } = useToast();

  const router = useRouter();

  useEffect(() => {
    async function getC() {
      const res = await getCsrfToken();

      setCsrfToken(res);

      return res;
    }

    getC();
  }, []);

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    await signIn("Credentials", {
      email,
      password,
      redirect: false,
    })
      .then((res: SignInResponse) => {
        // set loading btn to idle

        if (res.ok) {
          // router.push("/dashboard");
          console.log("oke");
        } else {
          setPassword((p) => "");
          toast({
            title: "Gagal masuk",
            description: "Email atau password salah",
            variant: "destructive",
          });
        }

        console.log(res, email, password);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <input type='hidden' name='csrfToken' defaultValue={csrfToken} />
        <div className='grid gap-2'>
          <div className='grid gap-3'>
            <Label className='sr-only' htmlFor='email'>
              Email
            </Label>
            <Input
              id='email'
              placeholder='NIY atau Email'
              type='text'
              autoCapitalize='none'
              autoComplete='email'
              autoCorrect='off'
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
            <Input
              id='password'
              placeholder='password'
              type='password'
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          <Button type='submit' disabled={isLoading}>
            {isLoading && <IconLoader className='mr-2 h-4 w-4 animate-spin' />}
            Masuk
          </Button>
        </div>
      </form>
    </div>
  );
}
