// zustand state management for authenticated user

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { api } from "@/lib/api";

// create type for user
type AuthType = {
  user: any;
  setUser: (user: any) => void;
  getAuth: () => Promise<any>;
};

export const useAuth = create<AuthType>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),
      getAuth: async () => {
        const response = await api.post("/auth/me");
        const user = response.data;
        // console.log(user);
        set({ user });

        return user;
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
