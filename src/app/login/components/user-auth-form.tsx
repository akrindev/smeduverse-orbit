"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconLoader } from "@tabler/icons-react";
import { SignInResponse, getCsrfToken, signIn } from "next-auth/react";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [csrfToken, setCsrfToken] = useState<string | undefined>("");

  const passwordRef = useRef<HTMLInputElement>(null);

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

  // this is the function that will be called when the form is submitted
  function onSubmit(event: React.SyntheticEvent) {
    // prevent the default form submit
    event.preventDefault();

    // start the loading state
    setIsLoading(true);

    // call the `signIn` function and pass in the email and password
    signIn("credentials", {
      email,
      password,
      redirect: false,
    })
      .then((res: SignInResponse) => {
        // if there was an error
        if (res.error) {
          // show an error toast
          toast({
            title: "Error",
            description: "Identitas masih salah",
            variant: "destructive",
          });

          // then reset the password field
          setPassword((prev) => "");

          // then autofocus the password field
          passwordRef.current?.focus();
        }

        // if there was no error
        if (!res.error) {
          // show a success toast
          toast({
            title: "Success",
            description: "Berhasil masuk",
          });

          // then redirect the user to the home page
          router.push("/dashboard");
        }
      })
      .finally(() => {
        // reset the loading state
        setIsLoading(false);
      });
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <input type="hidden" name="csrfToken" defaultValue={csrfToken} />
        <div className="grid gap-2">
          <div className="mb-5 grid space-y-5">
            <Input
              id="email"
              placeholder="NIY atau Email"
              type="text"
              autoFocus
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              value={email}
              required
            />
            <Input
              ref={passwordRef}
              id="password"
              placeholder="password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              value={password}
              required
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <IconLoader className="mr-2 h-4 w-4 animate-spin" />}
            Masuk
          </Button>
        </div>
      </form>
    </div>
  );
}
