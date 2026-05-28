// src/types/useAuth.ts
import { createContext, useContext, useState, useEffect } from "react";
import type { User } from "@/types/api";
import type { LoginResponse } from "@/types/auth";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  login: (response: LoginResponse) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("auth");
    if (stored) {
      const parsed = JSON.parse(stored) as LoginResponse;
      setUser(parsed.user);
      setToken(parsed.token);
    }
  }, []);

  const login = (response: LoginResponse) => {
    setUser(response.user);
    setToken(response.token);
    localStorage.setItem("auth", JSON.stringify(response));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("auth");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
