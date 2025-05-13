"use server";

import { api } from "./api";
import { signOut } from "next-auth/react";

// Function to handle sign out with Laravel Sanctum
export async function signOutAction() {
  try {
    // Call Laravel Sanctum logout endpoint to invalidate session
    await api.post("/auth/logout");
  } catch (error) {
    console.error("Error during server logout:", error);
  }

  // Also sign out from NextAuth
  return await signOut({
    callbackUrl: "/login",
  });
}
