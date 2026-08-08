"use client";
import { createContext } from "react";

const AuthContext = createContext<{ user: any } | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const value = null;
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
