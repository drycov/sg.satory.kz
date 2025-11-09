// src/context/AuthContext.tsx
import { createContext, useContext } from "react";
import useAuth, { type UserProfile } from "@/hooks/useAuth";

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (u: string, p: string) => void;
  logout: () => void;
  checkAuth: () => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used inside <AuthProvider>");
  return ctx;
};
