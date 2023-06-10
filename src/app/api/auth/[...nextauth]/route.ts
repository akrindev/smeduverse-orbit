import NextAuth, { DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";

const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  // enabe JWT
  session: {
    strategy: "jwt",
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
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)
        const res = await fetch(
          new URL(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`),
          {
            method: "POST",
            body: JSON.stringify(credentials),
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            cache: "no-store",
          }
        ); //.then((res) => res.json());

        // Any error will do
        if (res.status !== 200) return null;

        const { access_token } = await res.json();

        const user = await fetch(
          new URL(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`),
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${access_token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            cache: "no-store",
          }
        ).then((res) => res.json());

        // If no error and we have user data, return it
        if (res.ok && user) {
          return user;
        }

        // Return null if user data could not be retrieved
        return null;
      },
    }),
  ],

  callbacks: {
    // Assigning encoded token from API to token created in the session
    async jwt({ token, user, account, profile }) {
      if (user && account) {
        token.user = user;
        token.accessToken = account.access_token;
      }
      return token;
    },

    // Extending session object
    async session({ session, token, user }) {
      // @ts-expect-error
      session.user = token.user;
      return session;
    },
    async redirect({ url, baseUrl }) {
      // console.log("redirect", url, baseUrl);
      return url;
    },
  },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
