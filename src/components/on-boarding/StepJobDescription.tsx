import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface StepJobDescriptionProps {
  value: string;
  onChange: (value: string) => void;
}

const StepJobDescription = ({ value, onChange }: StepJobDescriptionProps) => {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
      <Label htmlFor="job-desc" className="text-lg font-bold">Pega aquí la descripción del empleo:</Label>
      <Textarea
        id="job-desc"
        placeholder="Ej: Buscamos un Desarrollador con experiencia en React..."
        className="min-h-[250px] rounded-2xl border-muted bg-muted/20 focus:bg-background transition-all resize-none p-4"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default StepJobDescription;
