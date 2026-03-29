import { Sparkles, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface TailorCVProps {
  onAdapt: (description: string) => void;
  description: string;
  setDescription: (value: string) => void;
}

const TailorCV = ({ onAdapt, description, setDescription }: TailorCVProps) => {

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim()) {
      onAdapt(description);
    }
  };

  return (
    <div className="flex-1 w-full max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2 text-center lg:text-left">
        <h1 className="text-3xl font-bold tracking-tight">Adaptar mi CV</h1>
        <p className="text-muted-foreground">
          Pega la descripción del empleo al que quieres aplicar y nuestra IA optimizará tu currículum automáticamente.
        </p>
      </div>

      <Card className="border-border shadow-xl rounded-2xl overflow-hidden bg-card">
        <CardHeader className="bg-muted/30 border-b border-border">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Descripción del Puesto
          </CardTitle>
          <CardDescription>
            Copia y pega todos los requisitos y responsabilidades del empleo.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Textarea 
              placeholder="Ejemplo: Buscamos un Desarrollador Frontend con experiencia en React, TypeScript y Tailwind CSS. Responsabilidades: Desarrollar nuevas funcionalidades, optimizar el rendimiento..."
              className="min-h-[300px] rounded-xl border-border focus:ring-primary/20 resize-none p-4 text-base"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            
            <Button 
              type="submit" 
              className="w-full py-7 rounded-2xl font-bold text-lg gap-2 shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
              disabled={!description.trim()}
            >
              <Sparkles className="w-5 h-5" />
              Adaptar CV ahora mismo
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-sm">¿Cómo funciona?</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Nuestra IA analizará la descripción, detectará las palabras clave más importantes y reescribirá tu resumen y experiencias para que coincidan perfectamente con lo que busca el reclutador.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TailorCV;
