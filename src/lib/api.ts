import Axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { getSession } from "next-auth/react";
import { cookies } from "next/dist/client/components/headers";

const api: AxiosInstance = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// interceptors to use the token from next-auth.js
// api.interceptors.request.use(async (config) => {
//   const session = await getSession();
//   if (session) {
//     console.log(session);
//     // config.headers.Authorization = `Bearer ${session.user}`;
//   }
//   return config;
// });

// interceptors to handle response errors
// when error is 401, redirect to login page
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.error(error.response);
    if (error && error.response?.status === 401) {
      window.location.href = "/login";
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
