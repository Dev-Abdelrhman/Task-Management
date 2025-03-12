import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null, // Store non-sensitive user data

      // Set user data (no token stored here)
      setUser: (user) => set({ user }),

      // Logout: Clear user data and storage
      logout: () => {
        set({ user: null });
        sessionStorage.removeItem("auth-storage"); // Ensure full logout
      },
    }),
    {
      name: "auth-storage", // Unique name for stored state
      getStorage: () => sessionStorage, // Change to localStorage if needed
    }
  )
);
