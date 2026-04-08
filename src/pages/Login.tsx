import { useState, useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import logoMascot from "@/assets/logo-mascot.svg";
import LoginForm from "@/components/auth/LoginForm";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useOnboardingState } from "@/hooks/useOnboardingState";

const Login = () => {
  const { isAuthenticated, isEmailUnconfirmed, clearUnconfirmedStatus } = useAuth();
  const { profile, loading: profileLoading, isNewUser } = useUserProfile();
  const { hasResumeData } = useOnboardingState(isAuthenticated);
  const navigate = useNavigate();

  // Manejar la redirección por email no confirmado como un efecto secundario
  // Esto evita el error "Cannot update a component while rendering a different component"
  useEffect(() => {
    if (isEmailUnconfirmed) {
      console.log("Email unconfirmed, redirecting to onboarding step 3...");
      navigate("/onboarding?step=3", { replace: true });
      // Limpiamos el estado del AuthContext para que no se buclee, 
      // pero el localStorage (email/password) permanece para que el StepAuth lo use.
      clearUnconfirmedStatus();
    }
  }, [isEmailUnconfirmed, navigate, clearUnconfirmedStatus]);

  if (isAuthenticated && !profileLoading) {
    if (isNewUser) {
      if (hasResumeData) return <Navigate to="/onboarding?step=4" replace />;
      return <Navigate to="/onboarding?step=1" replace />;
    }
    // Si llegamos aquí, el usuario ya tiene perfil. 
    // Marcamos el tag por si no existía (ej. entró desde otra PC) para el Traffic Controller del Onboarding.
    localStorage.setItem("onboarding_completed", "true");
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 pb-12 sm:pb-20">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Link to="/" className="group">
            <div className="w-32 h-32 transition-transform group-hover:scale-105">
              <img src={logoMascot} alt="CVealo Logo" className="w-full h-full object-contain" />
            </div>
          </Link>
        </div>

        <Card className="border-border shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">¡Bienvenido de nuevo!</CardTitle>
            <CardDescription>
              Ingresa tus credenciales para acceder a tu cuenta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm onToggle={() => {}} />
          </CardContent>
        </Card>
        
        <p className="mt-8 text-center text-sm text-muted-foreground">
          ¿No tienes una cuenta?{" "}
          <Link to="/onboarding" className="text-primary font-bold hover:underline">
            Empieza aquí y optimiza tu CV
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
