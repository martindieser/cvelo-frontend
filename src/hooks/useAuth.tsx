import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthUserViewModel } from "@/lib/viewmodels";
import { LoginRequestDTO, RegisterRequestDTO, LoginResponseDTO } from "@/lib/dtos";
import { apiFetch } from "@/lib/apiClient";

interface AuthContextType {
  user: AuthUserViewModel | null;
  isAuthenticated: boolean;
  isEmailUnconfirmed: boolean;
  unconfirmedEmail: string | null;
  unconfirmedPassword: string | null; // Nueva propiedad temporal
  loading: boolean;
  login: (data: LoginRequestDTO) => Promise<void>;
  register: (data: RegisterRequestDTO) => Promise<void>;
  verifyOtp: (email: string, code: string) => Promise<void>;
  logout: () => Promise<void>;
  clearSession: () => void;
  clearUnconfirmedStatus: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUserViewModel | null>(null);
  const [unconfirmedEmail, setUnconfirmedEmail] = useState<string | null>(null);
  const [unconfirmedPassword, setUnconfirmedPassword] = useState<string | null>(null);
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

  const clearSession = () => {
    setUser(null);
    setUnconfirmedEmail(null);
    setUnconfirmedPassword(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("onboarding_completed");
    localStorage.removeItem("onboarding_pending_email");
    localStorage.removeItem("onboarding_pending_password");
  };


  const login = async (data: LoginRequestDTO) => {
    setLoading(true);
    setUnconfirmedEmail(null);
    setUnconfirmedPassword(null);
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
    } catch (err: any) {
      // Si el servidor retorna 403, la cuenta no está confirmada
      if (err.status === 403) {
        console.log(`Login 403: Saving in storage - Email: ${data.email}`);
        setUnconfirmedEmail(data.email);
        setUnconfirmedPassword(data.password); 
        
        // Persistimos ambos para que el Onboarding los vea sin fallas
        localStorage.setItem("onboarding_pending_email", data.email);
        localStorage.setItem("onboarding_pending_password", data.password);
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearUnconfirmedStatus = () => {
    setUnconfirmedEmail(null);
    setUnconfirmedPassword(null);
  };


  const register = async (data: RegisterRequestDTO) => {
    setLoading(true);
    try {
      const response = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return response;
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (email: string, code: string) => {
    setLoading(true);
    try {
      const response: any = await apiFetch("/auth/otp-code", {
        method: "POST",
        body: JSON.stringify({ email, code }),
      });
      
      // Si la verificación devuelve token/user (login automático), los guardamos
      if (response && response.token) {
        const { user: apiUser, token } = response;
        const userVm: AuthUserViewModel = {
          id: apiUser.id,
          name: apiUser.name,
          email: apiUser.email
        };
        setUser(userVm);
        localStorage.setItem("user", JSON.stringify(userVm));
        localStorage.setItem("token", token);
      }
    } finally {
      setLoading(false);
    }
  };


  const logout = async () => {
    setLoading(true);
    try {
      await apiFetch("/auth/logout", { method: "POST" });
    } catch {
      // no importa si falla
    } finally {
      clearSession();
      setLoading(false);
    }
  };


  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isEmailUnconfirmed: !!unconfirmedEmail,
      unconfirmedEmail,
      unconfirmedPassword,
      loading, 
      login, 
      register, 
      verifyOtp,
      logout,
      clearSession,
      clearUnconfirmedStatus
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
