import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
// import { api, setAccessToken } from "./api";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  // Using cookies instead of JWT
  session: {
    strategy: "jwt", // Still using JWT for NextAuth, but with cookie authentication from Sanctum
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: {
          label: "Email / NIY",
          type: "text",
          placeholder: "Email / NIY",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        try {
          // First try to log in with Laravel Sanctum
          const loginRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
              credentials: "include",
              body: JSON.stringify({
                email,
                password,
              }),
            }
          );

          // If login failed
          if (!loginRes.ok) {
            console.error("Login failed:", await loginRes.text());
            return null;
          }

          // Parse login response
          const loginData = await loginRes.json();

          // Now fetch user info with the established session
          const userRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/user`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
              credentials: "include",
            }
          );

          // If user fetch failed
          if (!userRes.ok) {
            console.error("User fetch failed:", await userRes.text());
            return null;
          }

          // Parse user data
          const userData = await userRes.json();

          // Return user data for NextAuth session
          return {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            roles: userData.roles,
            teacher: userData.teacher,
            // Store access token temporarily if needed until we fully migrate
            // This will be removed once migration is complete
            access_token: loginData.access_token,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    // Assign token data from API to NextAuth JWT
    async jwt({ token, user }) {
      // Update the token with user data when signing in
      if (user) {
        token.user = user;
      }
      return token;
    },

    // Extend session object with user data
    async session({ session, token }) {
      // Add user data to session
      session.user = token.user as any;
      return session;
    },
    async redirect({ url, baseUrl }) {
      // console.log("redirect", url, baseUrl);
      return url;
    },
  },
  debug: process.env.NODE_ENV === "development",
  pages: {
    signIn: "/login",
  },
};
