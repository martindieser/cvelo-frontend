import { useState, useMemo } from "react";
import { Loader2, AlertCircle, Check, X, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

interface RegisterFormProps {
  onToggle: () => void;
  onRegistered: (email: string, password?: string) => void;
  hideToggle?: boolean;
}

const RegisterForm = ({ onToggle, onRegistered, hideToggle = false }: RegisterFormProps) => {
  // Estados para Registro
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const { register, loading } = useAuth();

  // Validación de política de contraseñas
  const passwordRequirements = useMemo(() => [
    { label: "Mínimo 8 caracteres", met: password.length >= 8 },
    { label: "Una mayúscula", met: /[A-Z]/.test(password) },
    { label: "Una minúscula", met: /[a-z]/.test(password) },
    { label: "Un número", met: /[0-9]/.test(password) },
    { label: "Un carácter especial (!@#$%^&*)", met: /[^A-Za-z0-9]/.test(password) },
  ], [password]);

  const isPasswordValid = passwordRequirements.every(req => req.met);
  const canSubmitRegister = isPasswordValid && email && password === confirmPassword && !loading;

  // Acción 1: Registro Inicial
  const handleRegister = async () => {
    if (!canSubmitRegister) return;
    setErrorMsg(null);

    try {
      await register({ name: "Nuevo Usuario", email, password });
      // Avisamos al orquestador que el registro fue exitoso
      onRegistered(email, password);
    } catch (error: any) {
      console.error("Error en registro:", error);
      const status = error?.status || error?.response?.status;
      if (status === 409) {
        setErrorMsg("Este correo electrónico ya está registrado.");
      } else {
        setErrorMsg("Hubo un problema al crear la cuenta. Inténtalo de nuevo.");
      }
    }
  };

  // Vista de Registro Inicial (Email/Password)
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-left-4">
      {errorMsg && (
        <Alert variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20 rounded-xl animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="font-medium ml-2">{errorMsg}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="email">Correo electrónico</Label>
        <Input 
          id="email" 
          type="email" 
          placeholder="tu@email.com" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-lg"
          disabled={loading}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <Input 
          id="password" 
          type="password" 
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-lg"
          disabled={loading}
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 p-3 bg-muted/30 rounded-xl border border-border/50">
          {passwordRequirements.map((req, i) => (
            <div key={i} className="flex items-center gap-2">
              {req.met ? <Check className="w-3 h-3 text-green-600" /> : <X className="w-3 h-3 text-muted-foreground/50" />}
              <span className={`text-[10px] font-medium ${req.met ? "text-green-700" : "text-muted-foreground"}`}>{req.label}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirmar contraseña</Label>
        <Input 
          id="confirm-password" 
          type="password" 
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={`rounded-lg ${confirmPassword && password !== confirmPassword ? "border-destructive" : ""}`}
          disabled={loading}
        />
      </div>
      
      <Button 
        onClick={handleRegister}
        className="w-full py-6 text-lg font-black rounded-xl mt-4" 
        disabled={!canSubmitRegister}
      >
        {loading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Creando cuenta...</> : "Registrarme"}
      </Button>
      
      {!hideToggle && (
        <p className="text-sm text-center text-muted-foreground mt-4">
          ¿Ya tienes una cuenta? <button type="button" onClick={onToggle} className="text-primary font-bold hover:underline">Inicia sesión</button>
        </p>
      )}
    </div>
  );
};

export default RegisterForm;
