import { toast } from "@/components/ui/use-toast";
import Axios, { AxiosError, AxiosInstance } from "axios";

// Create API client with correct configuration for Sanctum
const api: AxiosInstance = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  // Always include credentials with every request
  withCredentials: true,
});

// Interceptor to handle response errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message: string }>) => {
    // Handle validation errors (422 Unprocessable Entity)
    if (error.response?.status === 422) {
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

// Helper function to perform CSRF token refresh
const refreshCsrfToken = async () => {
  try {
    // Laravel Sanctum has a /sanctum/csrf-cookie endpoint to refresh CSRF token
    await Axios.get(`${process.env.NEXT_PUBLIC_API_URL}/sanctum/csrf-cookie`, {
      withCredentials: true,
    });
  } catch (error) {
    console.error("Failed to refresh CSRF token:", error);
  }
};

export { api, refreshCsrfToken };
