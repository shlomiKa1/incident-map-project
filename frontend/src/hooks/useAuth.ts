import { authApi } from "../api/auth.api";
import { useAuthStore } from "../store/auth.store";

export function useAuth() {
  const setUser = useAuthStore((state) => state.setUser);
  const setGuest = useAuthStore((state) => state.setGuest);

  const connect = async (
    email: string,
    password: string,
    type: "login" | "register",
  ) => {
    let data;

    if (type === "login") {
      data = await authApi.login({ email, password });
    } else {
      data = await authApi.register({ email, password });
    }

    if (data && data.user) {
      setUser(data?.user);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      setGuest();
    }
  };

  return { connect, logout };
}
