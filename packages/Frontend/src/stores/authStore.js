// zutand store for user authentication

// Create the store
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { logout as logoutApi } from "../api/auth";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null, // Store non-sensitive user data

      setUser: (user) => set({ user }),

      logout: async () => {
        try {
          await logoutApi();
          set({ user: null });
        } catch (error) {
          console.error("Logout error:", error);
        }
      },
    }),
    {
      name: "auth-storage",
      getStorage: () => localStorage, // Use localStorage for persistence
    }
  )
);