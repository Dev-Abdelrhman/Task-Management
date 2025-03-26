import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: localStorage.getItem("accessToken") || null,

      setUser: (user) => set({ user }),
      setAccessToken: (token) => {
        localStorage.setItem("accessToken", token);
        set({ accessToken: token });
      },

      logout: () => {
        set({ user: null, accessToken: null });
        localStorage.removeItem("accessToken");
        sessionStorage.clear();
      }
    }),
    {
      name: "auth-storage",
      getStorage: () => localStorage,
    }
  )
);
