import { DefaultSession, ISODateString } from "next-auth";

interface IUserSession {
  data: {
    id: string | null;
    name?: string | null;
    email?: string | null;
    roles?: Array<string> | string | null;
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
export interface ISession {
  user: IUserSession;
  expires: ISODateString;
}
