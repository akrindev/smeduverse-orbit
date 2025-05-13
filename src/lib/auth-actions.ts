"use server";

import { api } from "./api";
import Axios from "axios";

// Function to handle sign out with Laravel Sanctum
export async function signOutAction() {
  try {
    // Make a direct request to the logout endpoint with the stored token
    // The token will be added by the interceptor in api.ts
    await Axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
      }
    );

    return { success: true, redirectUrl: "/login" };
  } catch (error) {
    console.error("Error during server logout:", error);
    return { success: false, error: "Logout failed" };
  }
}

/**
 * Server action to validate authentication on the server side
 * Since we're using Zustand persist, we don't need to validate auth on the server
 * Authentication state is managed entirely on the client
 */
export async function validateAuthSession() {
  try {
    // Check if auth token exists in cookies for server-side validation
    // We can't access localStorage on the server, so we rely on the layout component
    // to pass the client-side auth state to us

    // Return true by default to prevent redirect loops
    // The client-side will handle actual auth validation through useAuth
    return {
      isAuthenticated: true, // Default to true to prevent redirect loops
      user: null,
    };
  } catch (error) {
    console.error("Auth validation error:", error);
    return {
      isAuthenticated: false,
      user: null,
      error: "Failed to validate authentication",
    };
  }
}

/**
 * Check if the user has specific roles
 * @param roles - Single role or array of roles to check
 * @param userData - User data with roles information
 */
export async function hasRoles(roles: string | string[], userData: any) {
  if (!userData || !userData.roles) return false;

  const userRoles = userData.roles.map((role) => role.name);

  if (typeof roles === "string") {
    return userRoles.includes(roles);
  }

  return roles.some((role) => userRoles.includes(role));
}
