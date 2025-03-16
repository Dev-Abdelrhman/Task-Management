import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,

      setUser: (user) => set({ user }),
      setAccessToken: (token) => set({ accessToken: token }),

      logout: () => {
        set({ user: null, accessToken: null });
        localStorage.removeItem("accessToken"); // Already present
        sessionStorage.clear(); // Clear all session storage
      }
    }),
    {
      name: "auth-storage",
      getStorage: () => localStorage,
    }
  )
);