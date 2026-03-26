import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import logoMascot from "@/assets/logo-mascot.svg";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const handleRegisterSuccess = (email: string) => {
    setRegisteredEmail(email);
    setIsRegistered(true);
  };

  if (isRegistered) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="flex justify-center mb-4">
            <div className="w-32 h-32">
              <img src={logoMascot} alt="CurriAI Logo" className="w-full h-full object-contain" />
            </div>
          </div>
          <div className="bg-card border border-border rounded-2xl p-8 shadow-lg space-y-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">¡Revisa tu correo!</h2>
              <p className="text-muted-foreground">
                Hemos enviado un enlace de verificación a <span className="font-semibold text-foreground">{registeredEmail}</span>. 
                Haz clic en el enlace para activar tu cuenta.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link to="/" className="group">
            <div className="w-32 h-32 transition-transform group-hover:scale-105">
              <img src={logoMascot} alt="CurriAI Logo" className="w-full h-full object-contain" />
            </div>
          </Link>
        </div>

        <Card className="border-border shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">
              {isLogin ? "¡Bienvenido de nuevo!" : "Crea tu cuenta"}
            </CardTitle>
            <CardDescription>
              {isLogin 
                ? "Ingresa tus credenciales para acceder a tu cuenta" 
                : "Empieza a optimizar tu CV en segundos"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLogin ? (
              <LoginForm onToggle={() => setIsLogin(false)} />
            ) : (
              <RegisterForm 
                onToggle={() => setIsLogin(true)} 
                onSuccess={handleRegisterSuccess} 
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
