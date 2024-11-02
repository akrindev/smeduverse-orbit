import { toast } from "@/components/ui/use-toast";
import Axios, { AxiosError, AxiosInstance } from "axios";

function getToken() {
  return fetch("/api/client", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
    cache: "no-store",
  })
    .then(async (res) => {
      // Check if the response body is empty
      if (res.ok && res.headers.get("content-length") !== "0") {
        return res.json();
      } else {
        throw new Error("No content or invalid JSON response");
      }
    })
    .then(({ access_token }) => access_token)
    .catch((error) => {
      console.error("Failed to retrieve token:", error);
      return null;
    });
}

const api: AxiosInstance = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// interceptors to use the token from next-auth.js
api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
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
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
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
