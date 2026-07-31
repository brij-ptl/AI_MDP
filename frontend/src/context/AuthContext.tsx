"use client";

import Cookies from "js-cookie";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { authService } from "@/services/auth.service";

type User = {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  role: "admin" | "user";
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<User | null>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  refreshUser: async () => null,
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const requestVersion = useRef(0);

  const refreshUser = useCallback(async () => {
    const version = ++requestVersion.current;
    try {
      const response = await authService.me() as User;
      if (version === requestVersion.current) setUser(response);
      return response;
    } catch {
      if (version === requestVersion.current) setUser(null);
      return null;
    } finally {
      if (version === requestVersion.current) setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    ++requestVersion.current;
    try {
      await authService.logout();
    } finally {
      Cookies.remove("nidaan_predictions_used");
      Cookies.remove("nidaan_subscribed");
      window.localStorage.clear();
      window.sessionStorage.clear();
      setUser(null);
      setLoading(false);
      window.location.href = "/login";
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  return <AuthContext.Provider value={{ user, loading, refreshUser, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
