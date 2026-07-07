import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api } from "../api.js";

const AuthContext = createContext(null);
const TOKEN_KEY = "productscribe-token";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);

  // On first load, if a token is saved, restore the session by fetching the profile.
  useEffect(() => {
    let cancelled = false;
    async function restore() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.me(token);
        if (!cancelled) setSeller(res.seller);
      } catch {
        // Token expired or invalid — clear it.
        if (!cancelled) {
          localStorage.removeItem(TOKEN_KEY);
          setToken(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    restore();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await api.login(email, password);
    localStorage.setItem(TOKEN_KEY, res.token);
    setToken(res.token);
    setSeller(res.seller);
    return res.seller;
  }, []);

  const signup = useCallback(async (businessName, email, password) => {
    const res = await api.signup(businessName, email, password);
    localStorage.setItem(TOKEN_KEY, res.token);
    setToken(res.token);
    setSeller(res.seller);
    return res.seller;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setSeller(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, seller, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}