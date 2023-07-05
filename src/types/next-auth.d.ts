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
    };
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
