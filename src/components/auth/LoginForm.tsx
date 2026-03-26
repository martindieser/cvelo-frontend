import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LoginFormProps {
  onToggle: () => void;
}

const LoginForm = ({ onToggle }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate("/");
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
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Contraseña</Label>
          <a href="#" className="text-sm text-primary hover:underline font-medium">
            ¿Olvidaste tu contraseña?
          </a>
        </div>
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
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Iniciando sesión...
          </>
        ) : (
          "Iniciar sesión"
        )}
      </Button>
      <p className="text-sm text-center text-muted-foreground mt-4">
        ¿No tienes una cuenta?{" "}
        <button 
          type="button"
          onClick={onToggle}
          className="text-primary font-bold hover:underline"
        >
          Regístrate gratis
        </button>
      </p>
    </form>
  );
};

export default LoginForm;
