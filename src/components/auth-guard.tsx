"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthQuery } from "@/hooks/useAuthQuery";
import { useAuth } from "@/store/useAuth";
import { Skeleton } from "./ui/skeleton";

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  roles?: string[];
}

/**
 * A component to protect routes that require authentication
 * Redirects to login page if user is not authenticated
 * Can also check for specific roles
 */
export default function AuthGuard({
  children,
  fallback,
  roles = [],
}: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuthQuery();
  const { handleAuthExpired } = useAuth();

  useEffect(() => {
    // If authentication check is complete and user is not authenticated
    if (!isLoading && !isAuthenticated) {
      handleAuthExpired();
      return;
    }

    // If roles are specified, check if user has required roles
    if (roles.length > 0 && user && user.roles) {
      const userRoles = user.roles.map((role) => role.name);
      const hasRequiredRole = roles.some((role) => userRoles.includes(role));

      if (!hasRequiredRole) {
        // Redirect to dashboard if user doesn't have required roles
        router.push("/dashboard");
      }
    }
  }, [isAuthenticated, isLoading, user, roles, router, handleAuthExpired]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      fallback || (
        <div className="flex flex-col space-y-5 p-5 h-full">
          <Skeleton className="w-[250px] h-4" />
          <Skeleton className="w-[350px] h-4" />
          <Skeleton className="w-[350px] h-4" />
        </div>
      )
    );
  }

  // If not authenticated, don't render children (will redirect in useEffect)
  if (!isAuthenticated) {
    return null;
  }

  // If roles are specified and user doesn't have required role, don't render
  if (roles.length > 0 && user && user.roles) {
    const userRoles = user.roles.map((role) => role.name);
    const hasRequiredRole = roles.some((role) => userRoles.includes(role));

    if (!hasRequiredRole) {
      return null;
    }
  }

  // User is authenticated, render children
  return <>{children}</>;
}
