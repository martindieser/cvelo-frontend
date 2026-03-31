import { ArrowLeft, Download, Pencil, Check, X, Sparkles, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InsightsContent } from "./InsightsPanel";
import { TailoredResumeViewModel } from "@/lib/viewmodels";
import PDFViewer from "./PDFViewer";

interface ResumePreviewProps {
  onBack: () => void;
  data: TailoredResumeViewModel;
  activeHighlight: string | null;
  onHighlightClick: (kw: string | null) => void;
}

const ResumePreview = ({ onBack, data, activeHighlight, onHighlightClick }: ResumePreviewProps) => {

  const { 
    pdfUrl,
    skills,
    summary,
    experience,
    education,
    languages,
    projects,
    certificates,
    jobName, 
    detectedKeywords, 
    appliedChanges 
  } = data;

  // Calcular el score de palabras clave
  const calculateScore = () => {
    if (!detectedKeywords || detectedKeywords.length === 0) return 0;
    
    // Normalizar texto para una comparación más justa
    const normalize = (text: string) => 
      text.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, ""); // Quita acentos pero mantiene espacios y puntuación básica

    // Unimos TODO el contenido del CV en un solo "corpus" de texto
    const corpusParts = [
      ...skills,
      summary,
      ...experience.map(exp => `${exp.role} ${exp.company} ${exp.details}`),
      ...projects.map(p => `${p.title} ${p.details} ${p.technologies.join(" ")}`),
      ...certificates,
      ...education.map(edu => `${edu.degree} ${edu.institution}`),
      ...languages.map(l => `${l.name} ${l.level}`)
    ];

    const normalizedCorpus = normalize(corpusParts.join(" "));

    const matchedKeywords = detectedKeywords.filter(kw => {
      const normalizedKw = normalize(kw).trim();
      if (!normalizedKw) return false;

      // Usamos una expresión regular para buscar la palabra clave con límites de palabra (\b)
      // Esto evita que "ant" coincida dentro de "relevant" o "React" dentro de "Reaction"
      // Escapamos caracteres especiales de la keyword para que no rompan la regex
      const escapedKw = normalizedKw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      
      // Si la keyword termina en un caracter especial (como C++ o .NET), 
      // \b al final puede fallar. En esos casos usamos un enfoque más flexible.
      const hasSpecialEnd = /[^a-zA-Z0-9]$/.test(normalizedKw);
      const regex = new RegExp(hasSpecialEnd ? `\\b${escapedKw}` : `\\b${escapedKw}\\b`, 'i');
      
      return regex.test(normalizedCorpus);
    });

    return Math.round((matchedKeywords.length / detectedKeywords.length) * 100);
  };

  const score = calculateScore();
  
  // Colores basados en el score
  const getScoreColor = (value: number) => {
    if (value >= 80) return "text-emerald-500 stroke-emerald-500";
    if (value >= 50) return "text-amber-500 stroke-amber-500";
    return "text-destructive stroke-destructive";
  };

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto space-y-4 md:space-y-6">
      <div className="flex items-center justify-between gap-4">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors shrink-0"
        >
          <ArrowLeft className="w-4 h-4" /> <span className="hidden sm:inline">Volver a la lista</span>
        </button>
        
        <div className="flex items-center gap-2">
          <div className="xl:hidden">
            <Drawer>
              <DrawerTrigger asChild>
                <Button className="gap-2 rounded-xl font-bold bg-primary/10 text-primary hover:bg-primary/20 border-none h-9 lg:h-10 text-xs lg:text-sm px-3 lg:px-4 shrink-0 shadow-none">
                  <Sparkles className="w-4 h-4" /> <span>Insights</span>
                </Button>
              </DrawerTrigger>
              <DrawerContent className="rounded-t-[32px] border-t-border bg-background max-h-[85vh]">
                <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted mt-4 mb-4" />
                <DrawerHeader className="text-left px-6">
                  <DrawerTitle className="text-xl font-bold flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Insights de CurriAI
                  </DrawerTitle>
                </DrawerHeader>
                <div className="px-6 overflow-y-auto custom-scrollbar pb-10">
                  <InsightsContent 
                    keywords={detectedKeywords} 
                    changes={appliedChanges} 
                    activeHighlight={activeHighlight}
                    onHighlightClick={onHighlightClick}
                  />
                </div>
              </DrawerContent>
            </Drawer>
          </div>

          <Button 
            variant="outline" 
            className="gap-2 rounded-xl font-bold border-border hover:bg-card h-9 lg:h-10 text-xs lg:text-sm px-3 lg:px-4 shrink-0"
            onClick={() => window.open(pdfUrl, '_blank')}
          >
            <Download className="w-4 h-4" /> <span className="hidden sm:inline">Descargar PDF</span><span className="sm:hidden">PDF</span>
          </Button>
        </div>
      </div>

      <div className="space-y-1 text-left">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          CV ADAPTADO PARA
        </span>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative flex items-center justify-center shrink-0 cursor-help">
                    <svg className="w-16 h-16 transform -rotate-90">
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="currentColor"
                        strokeWidth="5"
                        fill="transparent"
                        className="text-muted/30"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="currentColor"
                        strokeWidth="5"
                        fill="transparent"
                        strokeDasharray={175.9}
                        strokeDashoffset={175.9 - (175.9 * score) / 100}
                        strokeLinecap="round"
                        className={`transition-all duration-1000 ease-out ${getScoreColor(score)}`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={`text-sm font-black leading-none ${getScoreColor(score)}`}>{score}%</span>
                      <span className="text-[7px] font-bold text-muted-foreground uppercase">Keywords</span>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="p-3 max-w-[200px] text-center rounded-xl">
                  <p className="font-bold mb-1">Match de palabras clave</p>
                  <p className="text-xs text-muted-foreground">Este puntaje mide qué porcentaje de las palabras clave detectadas en la oferta están presentes en tu CV optimizado.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <h1 className="text-2xl lg:text-4xl font-bold tracking-tight truncate">{jobName}</h1>
          </div>
        </div>
      </div>

      {/* RENDERIZADO DEL PDF REAL */}
      <div className="h-[75vh] md:h-[calc(100vh-320px)] w-full">
        <PDFViewer url={pdfUrl} highlights={activeHighlight ? [activeHighlight] : []} />
      </div>
    </div>
  );
};

export default ResumePreview;
