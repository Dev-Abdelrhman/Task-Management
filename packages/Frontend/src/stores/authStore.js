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