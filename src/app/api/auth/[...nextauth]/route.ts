import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

export const runtime =
  process.env.NODE_ENV !== "production" ? "nodejs" : "edge";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
