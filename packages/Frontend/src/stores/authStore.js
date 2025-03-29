import axios from "axios";
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
      fetchUser: async () => {
        try {
          const res = await axios.get("http://localhost:5173/users/google/user", {
            withCredentials: true,  
          });
          set({ user: res.data.currentUser });
        } catch (error) {
          console.error("Error fetching user:", error);
          set({ user: null });
        }
      },

      logout: () => {
        set({ user: null, accessToken: null });
        // localStorage.removeItem("accessToken");
        // sessionStorage.clear();
      }
    }),
    {
      name: "auth-storage",
      getStorage: () => localStorage,
    }
  )
);
