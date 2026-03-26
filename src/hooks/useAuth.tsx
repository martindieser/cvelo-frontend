import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthUserViewModel } from "@/lib/viewmodels";
import { LoginRequestDTO, RegisterRequestDTO } from "@/lib/dtos";

interface AuthContextType {
  user: AuthUserViewModel | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (data: LoginRequestDTO) => Promise<void>;
  register: (data: RegisterRequestDTO) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user for simulation
const MOCK_USER: AuthUserViewModel = {
  id: "user_123",
  name: "Juan Pérez",
  email: "juan.perez@gmail.com"
};

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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      const loggedUser = { ...MOCK_USER, email: data.email };
      setUser(loggedUser);
      localStorage.setItem("user", JSON.stringify(loggedUser));
      localStorage.setItem("token", "mock_token_abc123");
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterRequestDTO) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const newUser = { 
        id: Math.random().toString(36).substr(2, 9),
        name: data.name,
        email: data.email
      };
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
      localStorage.setItem("token", "mock_token_reg456");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
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
