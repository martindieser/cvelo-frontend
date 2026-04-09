import { useState, useEffect } from "react";
import { 
  Globe, 
  Save, 
  Check
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
import { SectionViewModel } from "@/lib/viewmodels";
import { useUserSettings } from "@/hooks/useUserSettings";
import { useConfig } from "@/hooks/useConfig";
import LoadingScreen from "@/components/LoadingScreen";
import TemplateSelector from "@/components/cv-editor/TemplateSelector";
import SectionsOrderEditor from "@/components/cv-editor/SectionsOrderEditor";

interface SettingsProps {
  showContinue?: boolean;
  onContinue?: () => void;
}

const Settings = ({ showContinue = false, onContinue }: SettingsProps) => {
  const { settings, loading: settingsLoading, updateSettings } = useUserSettings();
  const { config, loading: configLoading } = useConfig();
  const [language, setLanguage] = useState("es");
  const [template, setTemplate] = useState("harvard");
  const [sections, setSections] = useState<SectionViewModel[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  if ((settingsLoading && !settings) || configLoading) {
    return <LoadingScreen fullScreen={false} message="Cargando tu configuración" />;
  }

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await updateSettings({
        language,
        template,
        sectionsOrder: sections
      });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
      if (onContinue) onContinue();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleVisibility = (id: string) => {
    setSections(prev => prev.map(s => 
      s.id === id ? { ...s, visible: !s.visible } : s
    ));
  };

  return (
    <div className={`flex-1 w-full max-w-4xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500 font-body ${showContinue ? 'pt-4' : ''}`}>
      {!showContinue && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Configuración</h1>
            <p className="text-muted-foreground">Personaliza cómo CVealo genera tus currículums.</p>
          </div>
          <div className="flex items-center gap-2 justify-center">
            <Button size="sm" className="rounded-xl font-bold gap-2 min-w-[120px]" onClick={handleSave}>
              {isSaved ? <><Check className="w-4 h-4" /> Guardado</> : <><Save className="w-4 h-4" /> Guardar</>}
            </Button>
          </div>
        </div>
      )}

      {showContinue && (
        <div className="bg-primary/5 border border-primary/10 rounded-3xl p-6 md:p-8 space-y-4 mb-8">
          <div className="flex items-center gap-3 text-left">
            <div className="bg-primary/10 p-2 rounded-xl">
              <Globe className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-black italic tracking-tight">Preferencias del Documento</h3>
              <p className="text-sm text-muted-foreground">Configura cómo quieres que se vea y se redacte tu currículum final.</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
        <Card className="border-border shadow-sm rounded-2xl md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><Globe className="w-5 h-5 text-primary" /> Idioma</CardTitle>
            <CardDescription>Idioma de redacción del CV final.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-w-md text-left">
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="rounded-xl h-12"><SelectValue /></SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="en">Inglés</SelectItem>
                  <SelectItem value="pt">Portugués</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2">
          <SectionsOrderEditor 
            sections={sections} 
            onReorder={setSections} 
            onToggleVisibility={handleToggleVisibility} 
          />
        </div>

        <div className="md:col-span-2">
          <TemplateSelector 
            templates={config.templates} 
            selectedId={template} 
            onSelect={(newTemplateId) => {
              setTemplate(newTemplateId);
              const selectedTemplateConfig = config.templates.find(t => t.id === newTemplateId);
              if (selectedTemplateConfig && selectedTemplateConfig.supportedSections) {
                setSections(prevSections => {
                  const supportedPrevSections = prevSections.filter(s => 
                    selectedTemplateConfig.supportedSections.includes(s.id)
                  );
                  const existingIds = new Set(supportedPrevSections.map(s => s.id));
                  const missingIds = selectedTemplateConfig.supportedSections.filter(id => !existingIds.has(id));
                  const newSectionsToAdd = config.defaultSections.filter(s => missingIds.includes(s.id));
                  return [...supportedPrevSections, ...newSectionsToAdd];
                });
              }
            }} 
          />
        </div>
      </div>

      {showContinue && (
        <div className="pt-8 border-t border-border flex justify-end">
          <Button 
            onClick={handleSave} 
            disabled={isSubmitting}
            className="w-full md:w-auto py-8 px-12 rounded-2xl font-black text-xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 gap-3"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                Guardando...
              </div>
            ) : (
              <>
                Continuar al análisis de IA <Check className="w-6 h-6" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Settings;
