"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "./api";

// Define user and role types
export interface Teacher {
  id: string;
  fullname: string;
  niy: string;
  photo: string;
  jenis_kelamin: string;
  tempat_lahir: string;
  tanggal_lahir: string;
}

export interface Role {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
  pivot: {
    model_id: string;
    role_id: number;
    model_type: string;
  };
}

export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  roles?: Role[] | null;
  teacher: Teacher;
}

// Auth context interface
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        // Fetch the current user from the API using the /api/user endpoint
        const response = await api.get("/api/user", { withCredentials: true });

        if (response.status === 200) {
          setUser(response.data);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);

      // Attempt to log in without refreshing CSRF token
      const response = await api.post(
        "/auth/login",
        {
          email,
          password,
        },
        { withCredentials: true }
      );

      // If login successful, fetch user data
      if (response.status === 200) {
        const userResponse = await api.get("/api/user", {
          withCredentials: true,
        });
        setUser(userResponse.data);
        return { success: true };
      }

      return { success: false, error: "Login failed" };
    } catch (error: any) {
      console.error("Login error:", error);
      return {
        success: false,
        error:
          error.response?.data?.message || "An error occurred during login",
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setIsLoading(true);
      // Call the logout endpoint
      await api.post("/auth/logout", {}, { withCredentials: true });
      setUser(null);
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh user data
  const refreshUser = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/api/user", { withCredentials: true });
      if (response.status === 200) {
        setUser(response.data);
      }
    } catch (error: any) {
      console.error("User refresh error:", error);
      // If refresh fails due to auth issues, clear user
      if (error.response?.status === 401) {
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Create the context value
  const contextValue: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Helper hook for protected routes
export function useRequireAuth(redirectTo: string = "/login") {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Get current path to redirect back after login
      const currentPath = window.location.pathname;
      router.push(`${redirectTo}?from=${encodeURIComponent(currentPath)}`);
    }
  }, [isAuthenticated, isLoading, redirectTo, router]);

  return { user, isLoading, isAuthenticated };
}
