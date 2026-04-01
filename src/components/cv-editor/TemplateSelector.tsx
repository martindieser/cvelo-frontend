import { useState, useEffect } from "react";
import { Check, Eye, Layout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { TemplateViewModel } from "@/lib/viewmodels";

interface TemplateSelectorProps {
  templates: TemplateViewModel[];
  selectedId: string;
  onSelect: (id: string) => void;
  title?: string;
  description?: string;
}

const TemplateSelector = ({ 
  templates, 
  selectedId, 
  onSelect,
  title = "Diseño del CV",
  description = "Elige el template base para tu currículum."
}: TemplateSelectorProps) => {
  const [previewTemplate, setPreviewTemplate] = useState<TemplateViewModel | null>(null);
  const [displayTemplate, setDisplayTemplate] = useState<TemplateViewModel | null>(null);

  useEffect(() => {
    if (previewTemplate) {
      setDisplayTemplate(previewTemplate);
    }
  }, [previewTemplate]);

  return (
    <>
      <Card className="border-border shadow-sm rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-left">
            <Layout className="w-5 h-5 text-primary" /> {title}
          </CardTitle>
          <CardDescription className="text-left">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {templates.map((t) => (
              <div 
                key={t.id}
                onClick={() => onSelect(t.id)}
                className={cn(
                  "cursor-pointer rounded-2xl border-2 p-4 transition-all hover:shadow-md group relative",
                  selectedId === t.id ? "border-primary bg-primary/5" : "border-border bg-card"
                )}
              >
                <div className={cn(
                  "aspect-[210/297] rounded-lg mb-3 border border-border flex items-center justify-center text-[10px] font-bold uppercase tracking-tighter text-muted-foreground/30 text-center overflow-hidden relative",
                  selectedId === t.id ? "bg-white border-primary/40 ring-2 ring-primary/10" : "bg-muted/30"
                )}>
                  {t.thumbnailUrl && t.thumbnailUrl !== "/placeholder.svg" ? (
                    <img 
                      src={t.thumbnailUrl} 
                      alt={t.name} 
                      className="w-full h-full object-contain" 
                    />
                  ) : (
                    <div className="px-2">Vista Previa {t.name}</div>
                  )}
                  
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button 
                      size="sm" 
                      variant="secondary" 
                      className="rounded-full h-10 w-10 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewTemplate(t);
                      }}
                    >
                      <Eye className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                <h4 className="font-bold text-sm mb-1 text-left">{t.name}</h4>
                <p className="text-[10px] text-muted-foreground leading-tight text-left">{t.description}</p>
                
                {selectedId === t.id && (
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                    <Check className="h-3 w-3" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!previewTemplate} onOpenChange={(open) => !open && setPreviewTemplate(null)}>
        <DialogContent className="max-w-3xl w-[95vw] max-h-[90vh] p-0 overflow-hidden bg-muted flex flex-col rounded-3xl border-none">
          <DialogHeader className="p-5 bg-background border-b shrink-0">
            <div className="text-left">
              <DialogTitle className="text-xl font-bold">{displayTemplate?.name}</DialogTitle>
              <p className="text-xs text-muted-foreground mt-0.5">{displayTemplate?.description}</p>
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-4 md:p-6 flex justify-center bg-muted/30 text-left">
            <div className="bg-white shadow-2xl rounded-sm w-full max-w-[750px] h-fit">
              {displayTemplate?.thumbnailUrl && (
                <img 
                  src={displayTemplate.thumbnailUrl} 
                  alt={displayTemplate.name} 
                  className="w-full h-auto block"
                />
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TemplateSelector;
