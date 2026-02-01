import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const setToken = useCallback((nextToken) => {
    const value = nextToken || "";
    setTokenState(value);
    if (value) localStorage.setItem("token", value);
    else localStorage.removeItem("token");
  }, []);

  const refreshMe = useCallback(async () => {
    const { data } = await api.get("/users/me");
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      void err;
    } finally {
      setToken("");
      setUser(null);
    }
  }, [setToken]);

  useEffect(() => {
    let alive = true;
    (async () => {
      setAuthLoading(true);
      if (!token) {
        if (alive) {
          setUser(null);
          setAuthLoading(false);
        }
        return;
      }
      try {
        await refreshMe();
        if (alive) setAuthLoading(false);
      } catch (err) {
        void err;
        if (!alive) return;
        setToken("");
        setUser(null);
        setAuthLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [token, refreshMe, setToken]);

  const value = useMemo(
    () => ({
      token,
      user,
      authLoading,
      setToken,
      setUser,
      refreshMe,
      logout,
      isAuthenticated: Boolean(token),
    }),
    [token, user, authLoading, setToken, refreshMe, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthProvider, AuthContext };
