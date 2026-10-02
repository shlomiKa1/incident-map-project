import { create } from "zustand";
import type { User } from "../types/user";

type AuthStatus = "checking" | "authenticated" | "guest";

interface AuthStore {
  user: User | null;
  status: AuthStatus;
  setUser: (user: User) => void;
  setGuest: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  status: "checking",
  setUser: (user) => set({ user, status: "authenticated" }),
  setGuest: () => set({ user: null, status: "guest" }),
}));
