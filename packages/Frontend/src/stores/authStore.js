// zutand store for user authentication

import { create } from "zustand";
import { persist } from "zustand/middleware";

// Create the store
export const useAuthStore = create(
  persist(
    (set) => ({
      user: null, // Store non-sensitive user data

      // Login: Update user data (token is handled via HTTP-only cookie)
      setUser: (user) => {
        set({ user });
      },

      // Logout: Clear user data
      logout: () => {
        set({ user: null });
      },
    }),
    {
      name: "auth-storage", // Unique name for the storage
      getStorage: () => sessionStorage, // Use sessionStorage or localStorage
    }
  )
);