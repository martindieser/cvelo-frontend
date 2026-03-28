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
import { Reorder } from "framer-motion";
import { cn } from "@/lib/utils";
import { SectionViewModel } from "@/lib/viewmodels";
import { useUserSettings } from "@/hooks/useUserSettings";
import LoadingScreen from "@/components/LoadingScreen";

const templates = [
  { id: "harvard", name: "Harvard (Classic)", description: "Limpio y profesional, estándar de la industria." },
];

const defaultSections = [
  { id: "summary", name: "Resumen", visible: true },
  { id: "experience", name: "Experiencia", visible: true },
  { id: "education", name: "Educación", visible: true },
  { id: "skills", name: "Habilidades", visible: true },
  { id: "languages", name: "Idiomas", visible: true },
  { id: "certificates", name: "Certificados", visible: true },
  { id: "projects", name: "Proyectos", visible: true },
];

const Settings = () => {
  const { settings, loading, updateSettings } = useUserSettings();
  const [language, setLanguage] = useState("es");
  const [template, setTemplate] = useState("harvard");
  const [sections, setSections] = useState<SectionViewModel[]>(defaultSections);
  const [isSaved, setIsSaved] = useState(false);

  // Sincronizar cuando cargan los settings
  useEffect(() => {
    if (settings) {
      setLanguage(settings.language);
      setTemplate(settings.template);
      setSections(settings.sectionsOrder);
    }
  }, [settings]);

  if (loading) {
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
    setSections(defaultSections);
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
              {templates.map((t) => (
                <div 
                  key={t.id}
                  onClick={() => setTemplate(t.id)}
                  className={cn(
                    "cursor-pointer rounded-2xl border-2 p-4 transition-all hover:shadow-md",
                    template === t.id ? "border-primary bg-primary/5" : "border-border bg-card"
                  )}
                >
                  <div className={cn(
                    "aspect-[3/4] rounded-lg mb-3 border border-border flex items-center justify-center text-[10px] font-bold uppercase tracking-tighter text-muted-foreground/30 text-center px-2",
                    template === t.id ? "bg-primary/10 border-primary/20" : "bg-muted/50"
                  )}>
                    Vista Previa {t.name}
                  </div>
                  <h4 className="font-bold text-sm mb-1">{t.name}</h4>
                  <p className="text-[10px] text-muted-foreground leading-tight">{t.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default Settings;
