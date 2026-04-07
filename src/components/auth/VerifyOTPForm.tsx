import { useState } from "react";
import { KeyRound, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

interface VerifyOTPFormProps {
  email: string;
  onSuccess: () => void;
  onBack: () => void;
}

const VerifyOTPForm = ({ email, onSuccess, onBack }: VerifyOTPFormProps) => {
  const [otpCode, setOtpCode] = useState("");
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { verifyOtp, login } = useAuth();

  const handleVerifyOtp = async () => {
    if (otpCode.length < 6) return;
    setVerifyingOtp(true);
    setErrorMsg(null);
    try {
      // 1. Verificamos el código
      await verifyOtp(email, otpCode);
      
      // 2. ÉXITO: El login automático se manejará aquí o arriba
      // Pero como necesitamos el password para el login automático y aquí no lo tenemos
      // (a menos que lo pasemos), simplemente avisamos que el OTP es válido.
      // Si el login automático requiere password, StepAuth deberá orquestarlo.
      onSuccess();
    } catch (err: any) {
      console.error("Error en verificación:", err);
      setErrorMsg("El código es incorrecto o ha expirado.");
    } finally {
      setVerifyingOtp(false);
    }
  };

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
          onClick={onBack}
          className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors"
        >
          ← Volver al registro
        </button>
      </div>
    </div>
  );
};

export default VerifyOTPForm;
