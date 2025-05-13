"use server";

import { api } from "./api";
import { cookies } from "next/headers";
import Axios from "axios";

// Function to handle sign out with Laravel Sanctum
export async function signOutAction() {
  try {
    // Get existing cookies to pass to the API
    const cookieStore = cookies();
    const cookieHeader = cookieStore
      .getAll()
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ");

    // Call Laravel Sanctum logout endpoint to invalidate session
    await Axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
      {},
      {
        headers: {
          Cookie: cookieHeader,
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        withCredentials: true,
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
 * This makes a request to the API to verify if the current session is valid
 */
export async function validateAuthSession() {
  try {
    // Get existing cookies to pass to the API
    const cookieStore = cookies();
    const cookieHeader = cookieStore
      .getAll()
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ");

    // Call the API to validate session using axios
    const response = await Axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/me`, // Use the same endpoint as client-side
      {
        headers: {
          Cookie: cookieHeader,
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        withCredentials: true,
      }
    );

    // If request is successful, the session is valid
    if (response.status === 200) {
      return {
        isAuthenticated: true,
        user: response.data,
      };
    }

    // This code should not be reached if response is successful
    return {
      isAuthenticated: false,
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
export function hasRoles(roles: string | string[], userData: any) {
  if (!userData || !userData.roles) return false;

  const userRoles = userData.roles.map((role) => role.name);

  if (typeof roles === "string") {
    return userRoles.includes(roles);
  }

  return roles.some((role) => userRoles.includes(role));
}
