import { toast } from "@/components/ui/use-toast";
import Axios, { AxiosError, AxiosInstance } from "axios";
import { useAuth } from "@/store/useAuth";

// Create API client with token-based authentication configuration
const api: AxiosInstance = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
  // Remove withCredentials since we're using token-based auth
});

// Interceptor to add bearer token to requests if available
api.interceptors.request.use(
  (config) => {
    // Check for token in localStorage (for SPA authentication)
    const token =
      typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle response errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message: string }>) => {
    // Only execute client-side code in browser environment
    if (typeof window !== "undefined") {
      // Handle unauthorized errors (401)
      if (error.response?.status === 401) {
        // Toast notification for auth failures
        try {
          toast({
            title: "Authentication Error",
            description: "Your session has expired. Please log in again.",
            variant: "destructive",
          });
        } catch (e) {
          console.error("Failed to show toast notification:", e);
        }

        // Use the handleAuthExpired function directly
        // Note: We can't use the hook here since this isn't a React component
        // So we need to clear localStorage manually
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth-storage");

        // Redirect to login without causing an infinite reload
        setTimeout(() => {
          window.location.href = "/login";
        }, 100);
      }

      // Handle validation errors (422 Unprocessable Entity)
      else if (error.response?.status === 422) {
        try {
          toast({
            title: "Validation Error",
            description:
              error.response?.data.message || "Please check your input",
            variant: "destructive",
          });
        } catch (e) {
          console.error("Failed to show toast notification:", e);
        }
      }
    }

    // Let the error propagate to be handled by the components
    return Promise.reject(error);
  }
);

export { api };
