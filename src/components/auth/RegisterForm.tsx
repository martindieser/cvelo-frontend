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
  onSuccess: (email: string) => void;
  hideToggle?: boolean;
}

const RegisterForm = ({ onToggle, onSuccess, hideToggle = false }: RegisterFormProps) => {
  // Estados para Registro
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Estados para OTP
  const [showOtp, setShowOtp] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  const { register, verifyOtp, login, loading } = useAuth();

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
      setShowOtp(true);
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

  // Acción 2: Verificación de OTP + Login Automático
  const handleVerifyOtp = async () => {
    if (otpCode.length < 6) return;
    setVerifyingOtp(true);
    setErrorMsg(null);
    try {
      // 1. Verificamos el código
      await verifyOtp(email, otpCode);
      
      // 2. Login automático en segundo plano usando las credenciales guardadas
      console.log("OTP verificado, iniciando sesión automática...");
      await login({ email, password });
      
      // 3. ÉXITO FINAL: Avanzamos el Onboarding
      onSuccess(email);
    } catch (err: any) {
      console.error("Error en verificación/login:", err);
      setErrorMsg("El código es incorrecto o hubo un error al iniciar sesión.");
    } finally {
      setVerifyingOtp(false);
    }
  };

  // Vista de Verificación OTP
  if (showOtp) {
    return (
      <div className="text-center py-4 space-y-8 animate-in fade-in slide-in-from-right-4">
        <div className="bg-primary/10 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto text-primary shadow-inner">
          <KeyRound className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-black">Verifica tu código</h3>
          <p className="text-sm text-muted-foreground">
            Ingresa el código enviado a <br/>
            <span className="font-bold text-foreground">{email}</span>
          </p>
        </div>

        <div className="flex flex-col items-center gap-6">
          <InputOTP
            maxLength={6}
            value={otpCode}
            onChange={(value) => setOtpCode(value)}
            onComplete={handleVerifyOtp}
          >
            <InputOTPGroup className="gap-2">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <InputOTPSlot key={i} index={i} className="w-10 h-12 text-xl font-bold rounded-xl border-2" />
              ))}
            </InputOTPGroup>
          </InputOTP>

          {errorMsg && (
            <Alert variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20 rounded-xl py-2">
              <AlertDescription className="font-medium text-[11px] text-center">
                {errorMsg}
              </AlertDescription>
            </Alert>
          )}

          <Button 
            onClick={handleVerifyOtp} 
            disabled={otpCode.length < 6 || verifyingOtp}
            className="w-full rounded-xl font-black h-12 shadow-lg"
          >
            {verifyingOtp ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Validando...
              </>
            ) : (
              "Confirmar y continuar"
            )}
          </Button>
          
          <button 
            onClick={() => setShowOtp(false)}
            className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors"
          >
            ← Volver al registro
          </button>
        </div>
      </div>
    );
  }

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
