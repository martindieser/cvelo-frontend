import { useState, useEffect } from "react";
import { 
  Globe, 
  Layout, 
  GripVertical, 
  Save, 
  RefreshCcw,
  Check,
  Eye,
  EyeOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
} from "@/components/ui/dialog";
import { Reorder } from "framer-motion";
import { cn } from "@/lib/utils";
import { SectionViewModel, TemplateViewModel } from "@/lib/viewmodels";
import { useUserSettings } from "@/hooks/useUserSettings";
import { useConfig } from "@/hooks/useConfig";
import LoadingScreen from "@/components/LoadingScreen";

const Settings = () => {
  const { settings, loading: settingsLoading, updateSettings } = useUserSettings();
  const { config, loading: configLoading } = useConfig();
  const [language, setLanguage] = useState("es");
  const [template, setTemplate] = useState("harvard");
  const [sections, setSections] = useState<SectionViewModel[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  
  // Estado para el modal de vista previa
  const [previewTemplate, setPreviewTemplate] = useState<TemplateViewModel | null>(null);

  // Sincronizar cuando cargan los settings
  useEffect(() => {
    if (settings) {
      setLanguage(settings.language);
      setTemplate(settings.template);
      setSections(settings.sectionsOrder && settings.sectionsOrder.length > 0 
        ? settings.sectionsOrder 
        : config.defaultSections
      );
    }
  }, [settings, config.defaultSections]);

  // Solo mostrar pantalla de carga si no tenemos los settings aún
  if ((settingsLoading && !settings) || configLoading) {
    return <LoadingScreen fullScreen={false} message="Cargando tu configuración" />;
  }

  const handleSave = () => {
    updateSettings({
      language,
      template,
      sectionsOrder: sections
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleReset = () => {
    setLanguage("es");
    setTemplate("harvard");
    setSections(config.defaultSections);
  };

  const toggleVisibility = (id: string) => {
    setSections(prev => prev.map(s => 
      s.id === id ? { ...s, visible: !s.visible } : s
    ));
  };

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500 font-body">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Configuración</h1>
          <p className="text-muted-foreground">
            Personaliza cómo CurriAI genera tus currículums adaptados.
          </p>
        </div>
        <div className="flex items-center gap-2 justify-center">
          <Button variant="outline" size="sm" className="rounded-xl font-bold gap-2" onClick={handleReset}>
            <RefreshCcw className="w-4 h-4" /> Restaurar
          </Button>
          <Button size="sm" className="rounded-xl font-bold gap-2 min-w-[120px]" onClick={handleSave}>
            {isSaved ? <><Check className="w-4 h-4" /> Guardado</> : <><Save className="w-4 h-4" /> Guardar</>}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Generación e Idioma */}
        <Card className="border-border shadow-sm rounded-2xl md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" /> Idioma de Generación
            </CardTitle>
            <CardDescription>Idioma en el que se redactará el CV final.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="max-w-md">
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="rounded-xl h-12">
                  <SelectValue placeholder="Selecciona un idioma" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="en">Inglés</SelectItem>
                  <SelectItem value="pt">Portugués</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Orden de Secciones (Drag & Drop) */}
        <Card className="border-border shadow-sm rounded-2xl md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <GripVertical className="w-5 h-5 text-primary" /> Orden de Secciones
            </CardTitle>
            <CardDescription>Arrastra para reordenar y usa el ojo para ocultar secciones.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-w-md overflow-hidden p-1">
              <Reorder.Group axis="y" values={sections} onReorder={setSections} className="space-y-2">
                {sections.map((section) => (
                  <Reorder.Item 
                    key={section.id} 
                    value={section}
                    className={cn(
                      "bg-card border border-border rounded-xl p-4 flex items-center justify-between cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md",
                      !section.visible && "opacity-50 grayscale"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <GripVertical className="w-4 h-4 text-muted-foreground" />
                      <span className="font-bold text-sm text-foreground">{section.name}</span>
                    </div>
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleVisibility(section.id);
                      }}
                      className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                      {section.visible ? (
                        <Eye className="w-4 h-4 text-primary" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            </div>
          </CardContent>
        </Card>

        {/* Plantilla Predeterminada */}
        <Card className="border-border shadow-sm rounded-2xl md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Layout className="w-5 h-5 text-primary" /> Diseño del CV
            </CardTitle>
            <CardDescription>Elige el template base para tus próximas descargas.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {config.templates.map((t) => (
                <div 
                  key={t.id}
                  onClick={() => setTemplate(t.id)}
                  className={cn(
                    "cursor-pointer rounded-2xl border-2 p-4 transition-all hover:shadow-md group relative",
                    template === t.id ? "border-primary bg-primary/5" : "border-border bg-card"
                  )}
                >
                  <div className={cn(
                    "aspect-[210/297] rounded-lg mb-3 border border-border flex items-center justify-center text-[10px] font-bold uppercase tracking-tighter text-muted-foreground/30 text-center overflow-hidden relative",
                    template === t.id ? "bg-white border-primary/40 ring-2 ring-primary/10" : "bg-muted/30"
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
                    
                    {/* Overlay de zoom al hacer hover */}
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
                  <h4 className="font-bold text-sm mb-1">{t.name}</h4>
                  <p className="text-[10px] text-muted-foreground leading-tight">{t.description}</p>
                  
                  {template === t.id && (
                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                      <Check className="h-3 w-3" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Modal de Vista Previa Full (Sin botón de seleccionar) */}
      <Dialog open={!!previewTemplate} onOpenChange={(open) => !open && setPreviewTemplate(null)}>
        <DialogContent className="max-w-3xl w-[95vw] max-h-[90vh] p-0 overflow-hidden bg-muted flex flex-col rounded-3xl border-none">
          <DialogHeader className="p-5 bg-background border-b shrink-0">
            <div className="text-left">
              <DialogTitle className="text-xl font-bold">{previewTemplate?.name}</DialogTitle>
              <p className="text-xs text-muted-foreground mt-0.5">{previewTemplate?.description}</p>
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-4 md:p-6 flex justify-center bg-muted/30">
            <div className="bg-white shadow-2xl rounded-sm w-full max-w-[750px] h-fit">
              {previewTemplate?.thumbnailUrl && (
                <img 
                  src={previewTemplate.thumbnailUrl} 
                  alt={previewTemplate.name} 
                  className="w-full h-auto block"
                />
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;
