import { Lock } from "lucide-react";
import RegisterForm from "@/components/auth/RegisterForm";

interface StepAuthProps {
  onSuccess: () => void;
}

const StepAuth = ({ onSuccess }: StepAuthProps) => {
  return (
    <div className="space-y-6 animate-in zoom-in-95">
      <div className="space-y-8">
        <div className="bg-primary/5 border border-primary/10 p-6 rounded-3xl flex items-center gap-4">
          <div className="bg-primary text-primary-foreground p-3 rounded-2xl shadow-lg">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-lg font-black leading-tight">Análisis completado</p>
            <p className="text-sm text-muted-foreground">Crea tu cuenta para generar tu documento.</p>
          </div>
        </div>
        
        <div className="pt-2">
          <RegisterForm 
            onToggle={() => {}} 
            onSuccess={onSuccess} 
            hideToggle={true}
          />
        </div>
      </div>
    </div>
  );
};

export default StepAuth;
