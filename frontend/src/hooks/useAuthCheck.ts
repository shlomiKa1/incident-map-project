import { useEffect } from "react";
import { useAuthStore } from "../store/auth.store";
import { authApi } from "../api/auth.api";

export function useAuthCheck() {
  const setUser = useAuthStore.getState().setUser;
  const setGuest = useAuthStore.getState().setGuest;

  useEffect(() => {
    let cancelled = false;

    authApi
      .me()
      .then(({ user }) => {
        if (!cancelled) setUser(user);
      })
      .catch(() => {
        if (!cancelled) setGuest();
      });

    return () => {
      cancelled = true;
    };
  }, [setUser, setGuest]);
}
