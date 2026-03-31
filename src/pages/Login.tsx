import { Link, Navigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import logoMascot from "@/assets/logo-mascot.svg";
import LoginForm from "@/components/auth/LoginForm";
import { useAuth } from "@/hooks/useAuth";

const Login = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 pb-12 sm:pb-20">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Link to="/" className="group">
            <div className="w-32 h-32 transition-transform group-hover:scale-105">
              <img src={logoMascot} alt="CurriAI Logo" className="w-full h-full object-contain" />
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
