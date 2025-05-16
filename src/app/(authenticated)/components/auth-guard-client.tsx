"use client";

import AuthGuard from "@/components/auth-guard";
import { ReactNode } from "react";

interface AuthGuardClientProps {
  children: ReactNode;
}

/**
 * Client component wrapper for AuthGuard to use in the layout
 */
export default function AuthGuardClient({ children }: AuthGuardClientProps) {
  return <AuthGuard>{children}</AuthGuard>;
}
