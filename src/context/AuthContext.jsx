import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api } from "../api.js";

const AuthContext = createContext(null);
const TOKEN_KEY = "productscribe-token";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const loginWithToken = useCallback(async (jwt) => {
    localStorage.setItem(TOKEN_KEY, jwt);
    setToken(jwt);
    const res = await api.me(jwt);
    setSeller(res.seller);
    return res.seller;
  }, []);

  // Permanently deletes the account (and, on the backend, every description
  // it owns). password is only required for local accounts — the Profile
  // page only asks for it when seller.authProvider === "local".
  const deleteAccount = useCallback(async (password) => {
    await api.deleteAccount(password);
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setSeller(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ token, seller, loading, login, signup, logout, loginWithToken, deleteAccount }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}