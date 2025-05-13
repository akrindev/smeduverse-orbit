// this file will handle auth role: authorization

import { useAuth } from "@/store/useAuth";
import type { User } from "@/store/useAuth";

// Check if user has a specific role
const hasRole = (user: User | null, role: string): boolean => {
  // If no user, return false
  if (!user) return false;

  // Get all roles names and store as array
  const roles = user.roles?.map((role) => role.name);

  if (!roles || roles.length === 0) return false;

  return roles.includes(role);
};

// Check if user has some roles
const hasRoles = (user: User | null, roles: string | string[]): boolean => {
  if (typeof roles === "string") return hasRole(user, roles);

  // If no user, return false
  if (!user) return false;

  return user.roles.some((role) =>
    typeof roles === "string" ? role.name === roles : roles.includes(role.name)
  );
};

// Check if user is the same user
const isUser = (user: User | null, userId: string): boolean => {
  // If no user, return false
  if (!user) return false;

  return user.id === userId;
};

// Client-side role checks
const useRoleCheck = () => {
  const { user } = useAuth();

  return {
    isAdmin: () => hasRole(user, "admin"),
    isGuru: () => hasRole(user, "guru"),
    isTeacher: () => hasRole(user, "guru"),
    isWakaKurikulum: () => hasRole(user, "waka kurikulum"),
    hasRole: (role: string) => hasRole(user, role),
    hasRoles: (roles: string | string[]) => hasRoles(user, roles),
    isUser: (userId: string) => isUser(user, userId),
  };
};

// Server-side role checks (for use in Server Components)
// These will require getting the user from cookies or other storage
const isAdmin = async () => {
  const { getCurrentUser } = useAuth.getState();
  const user = await getCurrentUser();
  return hasRole(user, "admin");
};

const isGuru = async () => {
  const { getCurrentUser } = useAuth.getState();
  const user = await getCurrentUser();
  return hasRole(user, "guru");
};

const isTeacher = async () => {
  const { getCurrentUser } = useAuth.getState();
  const user = await getCurrentUser();
  return hasRole(user, "guru");
};

const isWakaKurikulum = async () => {
  const { getCurrentUser } = useAuth.getState();
  const user = await getCurrentUser();
  return hasRole(user, "waka kurikulum");
};

export {
  hasRole,
  hasRoles,
  isAdmin,
  isGuru,
  isTeacher,
  isWakaKurikulum,
  isUser,
  useRoleCheck,
};
