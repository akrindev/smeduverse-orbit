import { toast } from "@/components/ui/use-toast";
import Axios, { AxiosError, AxiosInstance } from "axios";
import { getSession } from "next-auth/react";
import { notFound, redirect } from "next/navigation";
import { Session } from "next-auth";

const api: AxiosInstance = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Modify the interceptor to handle both client and server-side scenarios
api.interceptors.request.use(async (config) => {
  if (typeof window !== "undefined") {
    // Client-side
    const session = await getSession();
    if (session?.user.access_token) {
      config.headers.Authorization = `Bearer ${session.user.access_token}`;
    }
  }
  // For server-side, the token should be passed manually when making API calls
  return config;
});

// interceptors to handle response errors
// when error is 401, redirect to login page
api.interceptors.response.use(
  (response) => response,
  (
    error: AxiosError<{
      message: string;
    }>
  ) => {
    // console.error(error.response);
    if (error && error.response?.status === 401) {
      window.location.href = "/login";
    }

    if (error && error.response?.status === 422) {
      toast({
        title: "Error",
        description: error.response?.data.message,
        variant: "destructive",
      });
    }
    return Promise.reject(error);
  }
);

// set api access token
const setAccessToken = (token: string) => {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

// unset api access token
const unsetAccessToken = () => {
  delete api.defaults.headers.common["Authorization"];
};

export { api, setAccessToken, unsetAccessToken };
