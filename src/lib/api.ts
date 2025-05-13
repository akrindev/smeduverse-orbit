import { toast } from "@/components/ui/use-toast";
import Axios, { AxiosError, AxiosInstance } from "axios";

// Create API client with correct configuration for Sanctum
const api: AxiosInstance = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
  // Always include credentials with every request
  withCredentials: true,
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
    // Handle unauthorized errors (401)
    if (error.response?.status === 401) {
      // Clear authentication data
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
      }

      // Toast notification for auth failures
      toast({
        title: "Authentication Error",
        description: "Your session has expired. Please log in again.",
        variant: "destructive",
      });

      // Force redirect to login in client context
      if (typeof window !== "undefined") {
        window.location.pathname = "/login";
      }
    }

    // Handle validation errors (422 Unprocessable Entity)
    else if (error.response?.status === 422) {
      toast({
        title: "Validation Error",
        description: error.response?.data.message || "Please check your input",
        variant: "destructive",
      });
    }

    // Let the error propagate to be handled by the components
    return Promise.reject(error);
  }
);

export { api };
