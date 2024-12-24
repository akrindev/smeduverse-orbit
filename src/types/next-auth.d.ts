import NextAuth from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string | null;
      name?: string | null;
      email?: string | null;
      roles?: Role[] | null;
      teacher: {
        id: string;
        fullname: string;
        niy: string;
        photo: string;
        jenis_kelamin: string;
        tempat_lahir: string;
        tanggal_lahir: string;
      };
      access_token: string;
    } & DefaultSession["user"];
    access_token: string | null | undefined;
    expires_in: number | null | undefined;
  }

  interface Role {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
    pivot: {
      model_id: string;
      role_id: number;
      model_type: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    access_token: string; // Add accessToken to JWT
    expires_in: number; // Add expiresIn to JWT
  }
}
