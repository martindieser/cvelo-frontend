import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthUserViewModel } from "@/lib/viewmodels";
import { LoginRequestDTO, RegisterRequestDTO, LoginResponseDTO } from "@/lib/dtos";
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
      const response: LoginResponseDTO = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      });
      const { user: apiUser, token } = response;
      
      const userVm: AuthUserViewModel = {
        id: apiUser.id,
        name: apiUser.name,
        email: apiUser.email
      };

      setUser(userVm);
      localStorage.setItem("user", JSON.stringify(userVm));
      localStorage.setItem("token", token);
    } finally {
      setLoading(false);
    }
  };


  const register = async (data: RegisterRequestDTO) => {
    setLoading(true);
    try {
      // Register returns RegisterResponseDTO which doesn't include a token/user for immediate login
      // but based on the existing mock, we want to log in. 
      // Actually, looking at openapi.json, /auth/register returns 201 with message, user_id, email.
      // So the user probably needs to log in after registering, or the API should be changed.
      // For now, I'll follow the openapi and if it doesn't log in automatically, I'll just finish the call.
      const response = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      });

      // Based on OpenAPI, we don't get a token here. 
      // We might want to automatically call login after register if the API supports it,
      // but let's stick to the specs.
      console.log("Register successful:", response);
      
      // If the user expects to be logged in, we might need to perform a login here.
      // But RegisterResponseDTO doesn't have a password.
      // I'll keep it simple: just register. The UI should redirect to login or show success.
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
