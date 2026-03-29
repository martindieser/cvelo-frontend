import { ArrowLeft, Download, Pencil, Check, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
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
    optimizedSkills,
    jobName, 
    detectedKeywords, 
    appliedChanges 
  } = data;

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
          <div className="flex items-center gap-3">
            <h1 className="text-2xl lg:text-4xl font-bold tracking-tight truncate max-w-[250px] lg:max-w-none">{jobName}</h1>
            <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors shrink-0">
              <Pencil className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex-1 sm:flex-none p-2 rounded-xl bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors flex justify-center">
              <Check className="w-5 h-5" />
            </button>
            <button className="flex-1 sm:flex-none p-2 rounded-xl bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20 transition-colors flex justify-center">
              <X className="w-5 h-5" />
            </button>
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
