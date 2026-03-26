import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RegisterFormProps {
  onToggle: () => void;
  onSuccess: (email: string) => void;
}

const RegisterForm = ({ onToggle, onSuccess }: RegisterFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSuccess(email);
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirmar contraseña</Label>
        <Input 
          id="confirm-password" 
          type="password" 
          required 
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="rounded-lg"
        />
      </div>
      <Button 
        type="submit" 
        className="w-full py-6 text-lg font-bold rounded-lg mt-2" 
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Creando cuenta...
          </>
        ) : (
          "Registrarme"
        )}
      </Button>
      <p className="text-sm text-center text-muted-foreground mt-4">
        ¿Ya tienes una cuenta?{" "}
        <button 
          type="button"
          onClick={onToggle}
          className="text-primary font-bold hover:underline"
        >
          Inicia sesión
        </button>
      </p>
    </form>
  );
};

export default RegisterForm;
