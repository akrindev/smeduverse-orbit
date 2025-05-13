"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconLoader } from "@tabler/icons-react";

import { useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useAuthQuery } from "@/hooks/useAuthQuery";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const passwordRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const router = useRouter();

  // Use our custom auth hook
  const { loginMutation, isLoading, error } = useAuthQuery();

  // This function will be called when the form is submitted
  async function onSubmit(event: React.SyntheticEvent) {
    // Prevent the default form submit
    event.preventDefault();

    // Clear any previous errors
    setFormError(null);

    try {
      // Use the loginMutation instead of NextAuth signIn
      loginMutation.mutate(
        { email, password },
        {
          onSuccess: () => {
            // Authentication successful
            toast({
              title: "Login Successful",
              description: "Berhasil masuk",
            });

            // Get the redirect URL from query parameters or default to dashboard
            const from = searchParams.get("from") || "/dashboard";
            router.push(from);
          },
          onError: (error: any) => {
            console.error("Login error:", error);

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
          },
        }
      );
    } catch (error) {
      console.error("Unexpected error during login:", error);
      setFormError("An unexpected error occurred. Please try again.");

      toast({
        title: "Error",
        description: "Terjadi kesalahan. Silakan coba lagi.",
        variant: "destructive",
      });
    }
  }

  // Display either the form error or the auth store error
  const displayError = formError || error;

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      {displayError && (
        <div className="bg-red-100 px-4 py-3 border border-red-400 rounded text-red-700">
          {displayError}
        </div>
      )}

      <form onSubmit={onSubmit}>
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
