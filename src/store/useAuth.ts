// zustand state management for authenticated user

import { create } from "zustand";
import {
  createJSONStorage,
  persist,
  StateStorage,
  StorageValue,
} from "zustand/middleware";
import { api } from "@/lib/api";

// User type definition
export type User = {
  id: string;
  username: string;
  email: string;
  type: number;
  active: number;
  roles: Array<{
    id: number;
    name: string;
    pivot: {
      model_type: string;
      model_id: string;
      role_id: number;
    };
  }>;
  teacher?: {
    teacher_id: string;
    fullname: string;
    niy: string;
    jenis_kelamin: string;
    photo: string;
    about: string;
  };
  [key: string]: any; // Allow for additional properties
};

// Auth store type
type AuthState = {
  user: User | null;
  accessToken: string | null;
  tokenType: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setToken: (accessToken: string | null, tokenType: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<User | null>;
  handleAuthExpired: () => void;
};

// Persisted state type
type PersistedAuthState = {
  user: User | null;
  accessToken: string | null;
  tokenType: string | null;
  isAuthenticated: boolean;
};

// Custom storage with error handling for SSR and private browsing mode
const createCustomStorage = (): StateStorage => {
  return {
    getItem: (name: string): string | null => {
      if (typeof window === "undefined") return null;
      try {
        const value = localStorage.getItem(name);
        return value;
      } catch (error) {
        console.warn("Error accessing localStorage:", error);
        return null;
      }
    },
    setItem: (name: string, value: string): void => {
      if (typeof window === "undefined") return;
      try {
        localStorage.setItem(name, value);
        // Also set auth_token specifically for API client
        if (name === "auth-storage") {
          try {
            const parsedValue: StorageValue<PersistedAuthState> =
              JSON.parse(value);
            if (parsedValue.state.accessToken) {
              localStorage.setItem("auth_token", parsedValue.state.accessToken);
            }
          } catch (e) {
            console.error("Error parsing auth storage value:", e);
          }
        }
      } catch (error) {
        console.warn("Error writing to localStorage:", error);
      }
    },
    removeItem: (name: string): void => {
      if (typeof window === "undefined") return;
      try {
        localStorage.removeItem(name);
        // Also remove auth_token when auth storage is removed
        if (name === "auth-storage") {
          localStorage.removeItem("auth_token");
        }
      } catch (error) {
        console.warn("Error removing from localStorage:", error);
      }
    },
  };
};

// Create the auth store
export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      tokenType: null,
      isLoading: false,
      isAuthenticated: false,
      error: null,

      // Set user data
      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      // Set token
      setToken: (accessToken, tokenType) => {
        // Store token in localStorage for API requests
        if (typeof window !== "undefined") {
          if (accessToken) {
            localStorage.setItem("auth_token", accessToken);
          } else {
            localStorage.removeItem("auth_token");
          }
        }

        set({ accessToken, tokenType });
      },

      // Set loading state
      setLoading: (isLoading) => set({ isLoading }),

      // Set error message
      setError: (error) => set({ error }),

      // Handle expired authentication
      handleAuthExpired: () => {
        // Clear token and user data
        get().setToken(null, null);
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });

        // Clear localStorage data
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth_token");
          localStorage.removeItem("auth-storage");

          // Navigate to login page without page reload
          setTimeout(() => {
            window.location.href = "/login";
          }, 100);
        }
      },

      // Login function
      login: async (email, password) => {
        try {
          set({ isLoading: true, error: null });

          // Attempt to log in
          const response = await api.post("/auth/login", { email, password });

          // If login successful, save token and user data
          if (response.status === 200 && response.data) {
            const { access_token, token_type, user } = response.data;

            // Save token to localStorage for API client interceptor
            get().setToken(access_token, token_type);

            // Set user data and authentication state
            set({
              user,
              isAuthenticated: true,
              isLoading: false,
            });

            return { success: true };
          }

          return { success: false, error: "Login failed" };
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || "An error occurred during login";
          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false,
          });

          return { success: false, error: errorMessage };
        }
      },

      // Logout function
      logout: async () => {
        try {
          set({ isLoading: true });

          // Call the logout endpoint
          await api.post("/auth/logout");

          // Clear token and user data
          get().setToken(null, null);
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        } catch (error) {
          console.error("Logout error:", error);

          // Even on error, remove token and user data for security
          get().setToken(null, null);
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      // Get current user data
      getCurrentUser: async () => {
        try {
          // Don't set loading to true, as we're not making an API call
          // This will just return the persisted user data from the store

          // If we have a valid user in the store, return it
          if (get().user && get().isAuthenticated) {
            return get().user;
          }

          // Otherwise, return null (user is not authenticated)
          return null;
        } catch (error) {
          console.error("Get current user error:", error);
          set({
            user: null,
            isAuthenticated: false,
          });
          return null;
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(createCustomStorage),
      partialize: (state): PersistedAuthState => ({
        user: state.user,
        accessToken: state.accessToken,
        tokenType: state.tokenType,
        isAuthenticated: state.isAuthenticated,
      }),
      // Add version for future migration support
      version: 1,
      // Handle previous versions if needed in the future
      onRehydrateStorage: (state) => {
        return (rehydratedState, error) => {
          if (error) {
            console.error("Error rehydrating auth state:", error);
            return;
          }

          // If we have valid auth state, initialize the auth_token
          if (rehydratedState?.accessToken) {
            localStorage.setItem("auth_token", rehydratedState.accessToken);
          }

          console.log("Auth state rehydrated successfully");
        };
      },
    }
  )
);
