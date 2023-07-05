// this file will handle auth role: authorization

import { Session, getServerSession } from "next-auth";
import { authOptions } from "./auth";

const hasRole = async (role: string) => {
  const session = await getServerSession(authOptions);
  // if no session, return false
  if (!session) return false;

  //   get all roles name and store as array
  const roles = session.user.roles?.map((role) => role.name);

  if (roles && roles.length === 0) return false;

  return roles!.includes(role);
};

// check if user has some roles
const hasRoles = async (roles: string | string[]) => {
  if (typeof roles === "string") return hasRole(roles);

  const session = await getServerSession(authOptions);
  // if no session, return false
  if (!session) return false;

  return session.user.roles!.some((role) => roles.includes(role.name));
};

// check session is the same user
const isUser = (session: Session, userId: string) => {
  // if no session, return false
  if (!session) return false;

  return session.user.id === userId;
};

// is admin
const isAdmin = async () => await hasRole("admin");
// is guru
const isGuru = async () => await hasRole("guru");
const isTeacher = async () => await hasRole("guru");
// is waka kurikulum
const isWakaKurikulum = async () => await hasRole("waka kurikulum");

export {
  hasRole,
  hasRoles,
  isAdmin,
  isGuru,
  isTeacher,
  isWakaKurikulum,
  isUser,
};
