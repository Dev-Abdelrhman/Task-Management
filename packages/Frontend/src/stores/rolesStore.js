import { create } from "zustand";

export const useRoleStore = create((set) => ({
  roles: null,
  setRole: (role) => {
    set({ role });
  },
}));
