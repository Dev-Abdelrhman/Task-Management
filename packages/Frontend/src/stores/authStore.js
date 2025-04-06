import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,

  setUser: (user) => {
    if (user && typeof user === "object") {
      localStorage.setItem("user", JSON.stringify(user));
      set({ user });
    } else {
      console.error("Invalid user data, not storing in localStorage.");
    }
  },

  logout: () => {
    set({ user: null });
    localStorage.removeItem("user");
  },
}));

if (typeof window !== "undefined") {
  const storedUser = localStorage.getItem("user");

  if (storedUser) {
    try {
      if (storedUser.startsWith("{") || storedUser.startsWith("[")) {
        const parsedUser = JSON.parse(storedUser);

        if (parsedUser && typeof parsedUser === "object") {
          useAuthStore.getState().setUser(parsedUser);
        }
      } else {
        console.error("Invalid JSON format in localStorage, removing...");
        localStorage.removeItem("user");
      }
    } catch (error) {
      console.error("Error parsing stored user:", error);
      localStorage.removeItem("user");
    }
  }
}
