"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconLoader } from "@tabler/icons-react";
import { SignInResponse, getCsrfToken, signIn } from "next-auth/react";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { refreshCsrfToken } from "@/lib/api";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [csrfToken, setCsrfToken] = useState<string | undefined>("");
  const [error, setError] = useState<string | null>(null);

  const passwordRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const router = useRouter();

  // Get CSRF token for NextAuth
  useEffect(() => {
    async function getCsrf() {
      try {
        // First refresh Laravel Sanctum CSRF cookie
        await refreshCsrfToken();
        // Then get NextAuth CSRF token
        const res = await getCsrfToken();
        setCsrfToken(res);
      } catch (error) {
        console.error("Error getting CSRF token:", error);
        setError(
          "Failed to initialize login form. Please refresh and try again."
        );
      }
    }

    getCsrf();
  }, []);

  // This function will be called when the form is submitted
  async function onSubmit(event: React.SyntheticEvent) {
    // Prevent the default form submit
    event.preventDefault();

    // Clear any previous errors
    setError(null);

    // Start the loading state
    setIsLoading(true);

    try {
      // Call the `signIn` function and pass in the email and password
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      // Handle authentication errors
      if (result?.error) {
        console.error("Sign in error:", result.error);

        // Show an error toast
        toast({
          title: "Login Failed",
          description: "Email/NIY atau password salah",
          variant: "destructive",
        });

        // Reset the password field
        setPassword("");

        // Autofocus the password field
        passwordRef.current?.focus();

        return;
      }

      // Authentication successful
      toast({
        title: "Login Successful",
        description: "Berhasil masuk",
      });

      // Get the redirect URL from query parameters or default to dashboard
      const from = searchParams.get("from") || "/dashboard";
      router.push(from);
    } catch (error) {
      console.error("Unexpected error during sign in:", error);
      setError("An unexpected error occurred. Please try again.");

      toast({
        title: "Error",
        description: "Terjadi kesalahan. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      // Reset the loading state
      setIsLoading(false);
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      {error && (
        <div className="bg-red-100 px-4 py-3 border border-red-400 rounded text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit}>
        <input type="hidden" name="csrfToken" defaultValue={csrfToken} />
        <div className="gap-2 grid">
          <div className="space-y-5 grid mb-5">
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
            {isLoading && <IconLoader className="mr-2 w-4 h-4 animate-spin" />}
            Masuk
          </Button>
        </div>
      </form>
    </div>
  );
}
