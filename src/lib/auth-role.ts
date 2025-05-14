// this file will handle auth role: authorization

import { useAuth } from "@/store/useAuth";
import type { User } from "@/store/useAuth";
import { api } from "@/lib/api";

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

  const verifyUserRole = async (role: string) => {
    // If we have a user, check the role immediately
    if (user) {
      return hasRole(user, role);
    }

    // If no user in store, try to fetch from API
    try {
      const response = await api.post("/auth/me");
      if (response.status === 200 && response.data) {
        // Update the user in the store
        useAuth.getState().setUser(response.data);
        return hasRole(response.data, role);
      }
    } catch (error) {
      // More detailed error logging
      if (error instanceof Error) {
        console.error(
          `Error fetching user data: ${error.name} - ${error.message}`
        );
      } else {
        console.error("Error fetching user data:", error);
      }
    }

    return false;
  };

  return {
    isAdmin: () => verifyUserRole("admin"),
    isGuru: () => verifyUserRole("guru"),
    isTeacher: () => verifyUserRole("guru"),
    isWakaKurikulum: () => verifyUserRole("waka kurikulum"),
    hasRole: (role: string) => verifyUserRole(role),
    hasRoles: async (roles: string | string[]) => {
      if (typeof roles === "string") return verifyUserRole(roles);

      // For multiple roles, check if any match
      if (user) {
        return hasRoles(user, roles);
      }

      // Try to fetch user from API if not available
      try {
        const response = await api.post("/auth/me");
        if (response.status === 200 && response.data) {
          // Update the user in the store
          useAuth.getState().setUser(response.data);
          return hasRoles(response.data, roles);
        }
      } catch (error) {
        // More detailed error logging
        if (error instanceof Error) {
          console.error(
            `Error fetching user data: ${error.name} - ${error.message}`
          );
        } else {
          console.error("Error fetching user data:", error);
        }
      }

      return false;
    },
    isUser: async (userId: string) => {
      if (user) {
        return isUser(user, userId);
      }

      // Try to fetch user from API if not available
      try {
        const response = await api.post("/auth/me");
        if (response.status === 200 && response.data) {
          // Update the user in the store
          useAuth.getState().setUser(response.data);
          return isUser(response.data, userId);
        }
      } catch (error) {
        // More detailed error logging
        if (error instanceof Error) {
          console.error(
            `Error fetching user data: ${error.name} - ${error.message}`
          );
        } else {
          console.error("Error fetching user data:", error);
        }
      }

      return false;
    },
  };
};

// Server-side role checks (for use in Server Components)
// These will require getting the user from cookies or other storage
const isAdmin = async () => {
  try {
    const { getCurrentUser } = useAuth.getState();
    const user = await getCurrentUser();

    // If user exists in store, check the role
    if (user) {
      return hasRole(user, "admin");
    }

    // If no user in store, try to fetch from API
    try {
      const response = await api.post("/auth/me");
      if (response.status === 200 && response.data) {
        // Update the user in the store
        useAuth.getState().setUser(response.data);
        return hasRole(response.data, "admin");
      }
    } catch (error) {
      // More detailed error logging
      if (error instanceof Error) {
        console.error(
          `Error fetching user data: ${error.name} - ${error.message}`
        );
      } else {
        console.error("Error fetching user data:", error);
      }
    }

    return false;
  } catch (error) {
    console.error("Error checking role:", error);
    return false;
  }
};

const isGuru = async () => {
  try {
    const { getCurrentUser } = useAuth.getState();
    const user = await getCurrentUser();

    // If user exists in store, check the role
    if (user) {
      return hasRole(user, "guru");
    }

    // If no user in store, try to fetch from API
    try {
      const response = await api.post("/auth/me");
      if (response.status === 200 && response.data) {
        // Update the user in the store
        useAuth.getState().setUser(response.data);
        return hasRole(response.data, "guru");
      }
    } catch (error) {
      // More detailed error logging
      if (error instanceof Error) {
        console.error(
          `Error fetching user data: ${error.name} - ${error.message}`
        );
      } else {
        console.error("Error fetching user data:", error);
      }
    }

    return false;
  } catch (error) {
    console.error("Error checking role:", error);
    return false;
  }
};

const isTeacher = async () => {
  try {
    const { getCurrentUser } = useAuth.getState();
    const user = await getCurrentUser();

    // If user exists in store, check the role
    if (user) {
      return hasRole(user, "guru");
    }

    // If no user in store, try to fetch from API
    try {
      const response = await api.post("/auth/me");
      if (response.status === 200 && response.data) {
        // Update the user in the store
        useAuth.getState().setUser(response.data);
        return hasRole(response.data, "guru");
      }
    } catch (error) {
      // More detailed error logging
      if (error instanceof Error) {
        console.error(
          `Error fetching user data: ${error.name} - ${error.message}`
        );
      } else {
        console.error("Error fetching user data:", error);
      }
    }

    return false;
  } catch (error) {
    console.error("Error checking role:", error);
    return false;
  }
};

const isWakaKurikulum = async () => {
  try {
    const { getCurrentUser } = useAuth.getState();
    const user = await getCurrentUser();

    // If user exists in store, check the role
    if (user) {
      return hasRole(user, "waka kurikulum");
    }

    // If no user in store, try to fetch from API
    try {
      const response = await api.post("/auth/me");
      if (response.status === 200 && response.data) {
        // Update the user in the store
        useAuth.getState().setUser(response.data);
        return hasRole(response.data, "waka kurikulum");
      }
    } catch (error) {
      // More detailed error logging
      if (error instanceof Error) {
        console.error(
          `Error fetching user data: ${error.name} - ${error.message}`
        );
      } else {
        console.error("Error fetching user data:", error);
      }
    }

    return false;
  } catch (error) {
    console.error("Error checking role:", error);
    return false;
  }
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
