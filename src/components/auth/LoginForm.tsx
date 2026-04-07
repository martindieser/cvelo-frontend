import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface LoginFormProps {
  onToggle: () => void;
  onSuccess?: () => void;
}

const LoginForm = ({ onToggle, onSuccess }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      await login({ email, password });
      if (onSuccess) {
        onSuccess();
      }
      // No navigation here. The ProtectedRoute or the parent component will handle it.
    } catch (error) {
      console.error("Login failed:", error);
      setErrorMsg("Correo electrónico o contraseña incorrectos. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorMsg && (
        <Alert variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20 rounded-xl animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="font-medium ml-2">
            {errorMsg}
          </AlertDescription>
        </Alert>
      )}
      <div className="space-y-2">
        <Label htmlFor="email">Correo electrónico</Label>
        <Input 
          id="email" 
          type="email" 
          placeholder="tu@email.com" 
          required 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-lg"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <Input 
          id="password" 
          type="password" 
          required 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-lg"
        />
      </div>
      <Button 
        type="submit" 
        className="w-full py-6 text-lg font-bold rounded-lg mt-2" 
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Iniciando sesión...
          </>
        ) : (
          "Iniciar Sesión"
        )}
      </Button>
      </form>
      );
      };

export default LoginForm;
