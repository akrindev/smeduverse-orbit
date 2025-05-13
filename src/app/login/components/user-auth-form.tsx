"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconLoader } from "@tabler/icons-react";
import { IconEye, IconEyeOff } from "@tabler/icons-react";

import { useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/store/useAuth";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

// Main component that doesn't directly use searchParams
export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  return (
    <Suspense fallback={<div>Loading form...</div>}>
      <UserAuthFormContent className={className} {...props} />
    </Suspense>
  );
}

// Inner component that uses searchParams
function UserAuthFormContent({ className, ...props }: UserAuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const passwordRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const router = useRouter();

  // Use the Zustand store directly instead of useAuthQuery
  const { login, error, isLoading } = useAuth();

  // This function will be called when the form is submitted
  async function onSubmit(event: React.SyntheticEvent) {
    // Prevent the default form submit
    event.preventDefault();

    // Prevent multiple submissions
    if (isLoggingIn) return;

    // Clear any previous errors
    setFormError(null);

    try {
      setIsLoggingIn(true);

      // Use the login function from Zustand store directly
      const result = await login(email, password);

      if (result.success) {
        // Authentication successful
        toast({
          title: "Login Successful",
          description: "Berhasil masuk",
        });

        // Get the redirect URL from query parameters or default to dashboard
        const from = searchParams.get("from") || "/dashboard";

        // Simple redirection approach
        window.location.href = from;
      } else {
        // Handle login failure
        setFormError(result.error || "Login failed");

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
      }
    } catch (error: any) {
      console.error("Unexpected error during login:", error);
      setFormError("An unexpected error occurred. Please try again.");

      toast({
        title: "Error",
        description: "Terjadi kesalahan. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsLoggingIn(false);
    }
  }

  // Display either the form error or the auth store error
  const displayError = formError || error;
  const showLoading = isLoading || isLoggingIn;

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
              disabled={showLoading}
              value={email}
              required
            />
            <div className="relative">
              <Input
                ref={passwordRef}
                id="password"
                placeholder="password"
                type={showPassword ? "text" : "password"}
                onChange={(e) => setPassword(e.target.value)}
                disabled={showLoading}
                value={password}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="top-1/2 right-3 absolute text-gray-500 hover:text-gray-700 -translate-y-1/2 transform"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <IconEyeOff className="w-5 h-5" />
                ) : (
                  <IconEye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
          <Button type="submit" disabled={showLoading}>
            {showLoading && (
              <IconLoader className="mr-2 w-4 h-4 animate-spin" />
            )}
            Masuk
          </Button>
        </div>
      </form>
    </div>
  );
}
