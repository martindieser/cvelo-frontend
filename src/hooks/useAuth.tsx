import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthUserViewModel } from "@/lib/viewmodels";
import { LoginRequestDTO, RegisterRequestDTO } from "@/lib/dtos";
import { apiFetch } from "@/lib/apiClient";

interface AuthContextType {
  user: AuthUserViewModel | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (data: LoginRequestDTO) => Promise<void>;
  register: (data: RegisterRequestDTO) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUserViewModel | null>(null);
  const [loading, setLoading] = useState(true);

    useEffect(() => {
      // Check for existing session
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          localStorage.removeItem("user");
        }
      }
      setLoading(false);
    }, []);


  const login = async (data: LoginRequestDTO) => {
    setLoading(true);
    try {
      const response = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      });
      const { user, token } = response;
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
    } finally {
      setLoading(false);
    }
  };


  const register = async (data: RegisterRequestDTO) => {
    setLoading(true);
    try {
      const response = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      });

      const { user, token } = response;

      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
    } finally {
      setLoading(false);
    }
  };


  const logout = async () => {
    try {
      await apiFetch("/auth/logout", { method: "POST" });
    } catch {
      // no importa si falla
    }

    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };


  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      loading, 
      login, 
      register, 
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
