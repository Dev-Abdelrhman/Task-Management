import { create } from "zustand";

export const useProjecthStore = create((set) => ({
  Projects: null,

  setProject: (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    set({ user });
  },

  logout: () => {
    set({ user: null });
    localStorage.removeItem("user");
  },
}));
