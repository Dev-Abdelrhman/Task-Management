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
          const res = await axios.get(
            "http://localhost:9999/depiV1/users/google/user",
            { withCredentials: true }
          );

          console.log("Full API response:", res); // ✅ Debugging

          if (!res || !res.data) {
            console.error("Invalid response:", res);
            return null; // Avoid breaking the app
          }

          console.log("Fetched user:", res.data.user);
          set({ user: res.data.user });

          return res.data; // ✅ Return the full response
        } catch (error) {
          console.error("Error fetching user:", error);
          set({ user: null });
          return null; // ✅ Prevent errors in `handleGoogleCallbackMutation`
        }
      },

      logout: () => {
        set({ user: null, accessToken: null });
        // localStorage.removeItem("accessToken");
        // sessionStorage.clear();
      },
    }),
    {
      name: "auth-storage",
      getStorage: () => localStorage,
    }
  )
);
