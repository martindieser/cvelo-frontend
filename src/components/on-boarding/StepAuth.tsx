import { useState, useEffect } from "react";
import { Lock } from "lucide-react";
import RegisterForm from "@/components/auth/RegisterForm";
import VerifyOTPForm from "@/components/auth/VerifyOTPForm";
import { useAuth } from "@/hooks/useAuth";
import { useOnboardingState } from "@/hooks/useOnboardingState";

interface StepAuthProps {
  onSuccess: () => void;
}

const StepAuth = ({ onSuccess }: StepAuthProps) => {
  const { 
    isAuthenticated, 
    unconfirmedPassword, 
    clearUnconfirmedStatus, 
    login 
  } = useAuth();
  
  const { 
    pendingEmail, 
    setOnboardingPendingEmail 
  } = useOnboardingState(isAuthenticated);

  const [password, setPassword] = useState(""); // Memoria para registro reciente
  const [view, setView] = useState<"register" | "verify">(pendingEmail ? "verify" : "register");

  const handleRegistered = (registeredEmail: string, registeredPassword?: string) => {
    if (registeredPassword) setPassword(registeredPassword);
    setOnboardingPendingEmail(registeredEmail);
    setView("verify");
  };

  const handleVerifySuccess = async () => {
    // CAPTURAMOS LOS DATOS INMEDIATAMENTE
    const emailToUse = pendingEmail || localStorage.getItem("onboarding_pending_email");
    const passwordToUse = password || unconfirmedPassword || localStorage.getItem("onboarding_pending_password");
    
    console.log(`OTP Success. Attempting auto-login. Email: ${!!emailToUse}, Password: ${!!passwordToUse}`);
    
    if (passwordToUse && emailToUse) {
      try {
        console.log("Realizando login automático tras OTP...");
        await login({ email: emailToUse, password: passwordToUse });
        
        // LIMPIEZA SOLO DESPUÉS DEL ÉXITO
        setOnboardingPendingEmail(null);
        localStorage.removeItem("onboarding_pending_password");
        clearUnconfirmedStatus();
        
        onSuccess();
      } catch (err) {
        console.error("Auto-login failed after OTP:", err);
        // Si falla el login, igual llamamos a onSuccess para que el Traffic Controller 
        // decida qué hacer (probablemente pedir login manual)
        onSuccess();
      }
    } else {
      console.warn("Auto-login skipped: Missing credentials.");
      onSuccess();
    }
  };

  const handleBack = () => {
    setOnboardingPendingEmail(null);
    localStorage.removeItem("onboarding_pending_password");
    clearUnconfirmedStatus();
    setPassword("");
    setView("register");
  };

  return (
    <div className="space-y-6 animate-in zoom-in-95">
      <div className="space-y-8">
        {view === "register" && (
          <div className="bg-primary/5 border border-primary/10 p-6 rounded-3xl flex items-center gap-4">
            <div className="bg-primary text-primary-foreground p-3 rounded-2xl shadow-lg">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-lg font-black leading-tight">Análisis completado</p>
              <p className="text-sm text-muted-foreground">Crea tu cuenta para generar tu documento.</p>
            </div>
          </div>
        )}
        
        <div className="pt-2">
          {view === "register" ? (
            <RegisterForm 
              onToggle={() => {}} 
              onRegistered={handleRegistered} 
              hideToggle={true}
            />
          ) : (
            <VerifyOTPForm 
              email={pendingEmail || ""} 
              onSuccess={handleVerifySuccess} 
              onBack={handleBack}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default StepAuth;
