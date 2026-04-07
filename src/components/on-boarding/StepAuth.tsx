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
  const { isAuthenticated } = useAuth();
  const { 
    pendingEmail, 
    setOnboardingPendingEmail 
  } = useOnboardingState(isAuthenticated);

  const [password, setPassword] = useState(""); // Solo para login automático inmediato
  const [view, setView] = useState<"register" | "verify">(pendingEmail ? "verify" : "register");
  
  const { login } = useAuth();

  const handleRegistered = (registeredEmail: string, registeredPassword?: string) => {
    if (registeredPassword) setPassword(registeredPassword);
    setOnboardingPendingEmail(registeredEmail);
    setView("verify");
  };

  const handleVerifySuccess = async () => {
    // Si tenemos el password (recién registrado), hacemos login automático
    if (password && pendingEmail) {
      try {
        console.log("Realizando login automático tras OTP...");
        await login({ email: pendingEmail, password });
        cleanup();
        onSuccess();
      } catch (err) {
        console.error("Auto-login failed after OTP:", err);
        cleanup();
        onSuccess();
      }
    } else {
      cleanup();
      onSuccess();
    }
  };

  const cleanup = () => {
    setOnboardingPendingEmail(null);
  };

  const handleBack = () => {
    cleanup();
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
