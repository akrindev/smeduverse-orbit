import { DefaultSession } from "next-auth";

export interface ISession extends DefaultSession {
  user?: {
    name?: string | null;
    fullname?: string | null;
    email?: string | null;
    niy?: string | null;
    roles?: Array<string> | string | null;
  };
}
