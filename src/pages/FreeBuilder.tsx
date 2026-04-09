import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Download, RefreshCcw, Sparkles, AlertCircle, Layout, LayoutPanelLeft, LayoutList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger
} from "@/components/ui/dialog";
import logoMascot from "@/assets/logo-mascot.svg";
import PDFViewer from "@/components/dashboard/PDFViewer";
import LoadingScreen from "@/components/LoadingScreen";

// Hooks
import { useGuestProfile } from "@/hooks/useGuestProfile";
import { useConfig } from "@/hooks/useConfig";
import { useApi } from "@/hooks/useApi";
import { TaskResponseDTO, TaskStatusDTO } from "@/lib/dtos";

// Componentes del editor refactorizados
import GeneralSection from "@/components/cv-editor/GeneralSection";
import SummarySection from "@/components/cv-editor/SummarySection";
import ExperienceSection from "@/components/cv-editor/ExperienceSection";
import EducationSection from "@/components/cv-editor/EducationSection";
import SkillsSection from "@/components/cv-editor/SkillsSection";
import SocialLinksSection from "@/components/cv-editor/SocialLinksSection";
import LanguagesSection from "@/components/cv-editor/LanguagesSection";
import ProjectsSection from "@/components/cv-editor/ProjectsSection";
import CertificatesSection from "@/components/cv-editor/CertificatesSection";
import DeleteConfirmDialog from "@/components/cv-editor/DeleteConfirmDialog";
import TemplateSelector from "@/components/cv-editor/TemplateSelector";
import SectionsOrderEditor from "@/components/cv-editor/SectionsOrderEditor";

const FreeBuilder = () => {
  const { profile, updateProfile, updateSettings } = useGuestProfile();
  const { config, loading: configLoading } = useConfig();
  const { apiCall } = useApi();

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [isSectionsDialogOpen, setIsSectionsDialogOpen] = useState(false);
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteContext, setDeleteContext] = useState<{
    type: 'experience' | 'education' | 'social' | 'language' | 'project';
    id: string;
    name: string;
  } | null>(null);

  // Inicializar secciones por defecto si están vacías
  useEffect(() => {
    if (profile.settings.sectionsOrder.length === 0 && config.defaultSections.length > 0) {
      updateSettings({ sectionsOrder: config.defaultSections });
    }
  }, [config.defaultSections, profile.settings.sectionsOrder.length]);

  const pollTask = async (taskId: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      const interval = setInterval(async () => {
        try {
          const task: TaskStatusDTO = await apiCall(`/resumes/guest-tasks/${taskId}`);
          
          if (task.status === "COMPLETED") {
            clearInterval(interval);
            resolve(task.result);
          } else if (task.status === "FAILED") {
            clearInterval(interval);
            reject(new Error(task.error || "La generación del PDF falló."));
          }
        } catch (err) {
          clearInterval(interval);
          reject(err);
        }
      }, 2000);
    });
  };

  const handlePreview = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const renderReq = {
        template_id: profile.settings.template,
        sections_order: profile.settings.sectionsOrder,
        profile: {
          name: profile.name,
          email: profile.email,
          location: profile.location,
          phone: profile.phone,
          summary: profile.summary,
          skills: profile.skills,
          certificates: profile.certificates,
          social_links: profile.socialLinks.map(s => ({ platform: s.platform, url: s.url })),
          experience: profile.experience.map(e => ({
            role: e.role,
            company: e.company,
            period: e.period,
            details: e.details.split("\n").filter(d => d.trim() !== "")
          })),
          education: profile.education.map(edu => ({
            degree: edu.degree,
            institution: edu.institution,
            period: edu.period
          })),
          languages: profile.languages.map(l => ({
            name: l.name,
            level: l.level
          })),
          projects: profile.projects.map(p => ({
            title: p.title,
            details: p.details.split("\n").filter(d => d.trim() !== ""),
            technologies: p.technologies,
            link: p.link,
            period: p.period
          }))
        }
      };

      const response: TaskResponseDTO = await apiCall("/resumes/render-guest", {
        method: "POST",
        body: JSON.stringify(renderReq),
      });

      if (response && response.task_id) {
        const result = await pollTask(response.task_id);
        if (result && result.pdf_url) {
          setPdfUrl(result.pdf_url);
        } else {
          throw new Error("No se pudo obtener la URL del PDF.");
        }
      } else {
        throw new Error("No se pudo iniciar la generación del PDF.");
      }
    } catch (err: any) {
      console.error("Error al generar vista previa:", err);
      setError(err.message || "Error al generar el PDF. Revisa tus datos.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleVisibility = (id: string) => {
    const newOrder = profile.settings.sectionsOrder.map(s => 
      s.id === id ? { ...s, visible: !s.visible } : s
    );
    updateSettings({ sectionsOrder: newOrder });
  };

  const openDeleteConfirm = (type: 'experience' | 'education' | 'social' | 'language' | 'project', id: string, name: string) => {
    setDeleteContext({ type, id, name });
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deleteContext) return;
    const { type, id } = deleteContext;
    if (type === 'experience') updateProfile({ experience: profile.experience.filter(e => e.id !== id) });
    else if (type === 'education') updateProfile({ education: profile.education.filter(e => e.id !== id) });
    else if (type === 'social') updateProfile({ socialLinks: profile.socialLinks.filter(s => s.id !== id) });
    else if (type === 'language') updateProfile({ languages: profile.languages.filter(l => l.id !== id) });
    else if (type === 'project') updateProfile({ projects: profile.projects.filter(p => p.id !== id) });
    setIsDeleteDialogOpen(false);
    setDeleteContext(null);
  };

  if (configLoading) return <LoadingScreen message="Cargando editor..." />;

  const activeTemplate = config.templates.find(t => t.id === profile.settings.template);

  return (
    <div className="h-screen bg-background font-body flex flex-col overflow-hidden">
      
      <header className="h-16 border-b bg-card flex items-center justify-between px-4 shrink-0 z-20">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center group">
            <div className="w-16 h-16 transition-transform group-hover:scale-110">
              <img src={logoMascot} alt="CVealo" className="w-full h-full object-contain" />
            </div>
          </Link>

        </div>

        <div className="flex items-center gap-3">
          {/* DIÁLOGO DE TEMPLATE */}
          <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="rounded-xl font-bold gap-2 text-muted-foreground hover:text-primary hover:bg-primary/5">
                <Layout className="w-4 h-4" />
                <span className="hidden xs:inline">{activeTemplate?.name || "Diseño"}</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl rounded-3xl border-none shadow-2xl">
              <DialogHeader><DialogTitle className="text-2xl font-bold text-left text-foreground">Elige un diseño</DialogTitle></DialogHeader>
              <TemplateSelector 
                title=""
                description="El diseño se aplicará a tu PDF final."
                templates={config.templates} 
                selectedId={profile.settings.template} 
                onSelect={(id) => {
                  const newTemplateId = id as string;
                  const selectedTemplateConfig = config.templates.find(t => t.id === newTemplateId);
                  
                  if (selectedTemplateConfig && selectedTemplateConfig.supportedSections) {
                    const prevSections = profile.settings.sectionsOrder;
                    const supportedPrevSections = prevSections.filter(s => 
                      selectedTemplateConfig.supportedSections.includes(s.id)
                    );
                    const existingIds = new Set(supportedPrevSections.map(s => s.id));
                    const missingIds = selectedTemplateConfig.supportedSections.filter(sid => !existingIds.has(sid));
                    const newSectionsToAdd = config.defaultSections.filter(s => missingIds.includes(s.id));
                    
                    updateSettings({ 
                      template: newTemplateId as any,
                      sectionsOrder: [...supportedPrevSections, ...newSectionsToAdd]
                    });
                  } else {
                    updateSettings({ template: newTemplateId as any });
                  }
                  
                  setIsTemplateDialogOpen(false);
                }} 
              />
            </DialogContent>
          </Dialog>

          {/* DIÁLOGO DE SECCIONES (ESTRUCTURA) */}
          <Dialog open={isSectionsDialogOpen} onOpenChange={setIsSectionsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="rounded-xl font-bold gap-2 text-muted-foreground hover:text-primary hover:bg-primary/5">
                <LayoutList className="w-4 h-4" />
                <span className="hidden xs:inline">Estructura</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md rounded-3xl border-none shadow-2xl">
              <DialogHeader><DialogTitle className="text-2xl font-bold text-left text-foreground">Estructura del CV</DialogTitle></DialogHeader>
              <div className="py-4">
                <SectionsOrderEditor 
                  sections={profile.settings.sectionsOrder} 
                  onReorder={(sections) => updateSettings({ sectionsOrder: sections })} 
                  onToggleVisibility={handleToggleVisibility} 
                />
              </div>
            </DialogContent>
          </Dialog>

          <div className="h-6 w-px bg-border" />

          <Button 
            variant="secondary" 
            size="sm" 
            className="rounded-xl font-black gap-2 h-9 px-4"
            onClick={() => window.location.href = "/onboarding"}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Optimizar con IA</span>
            <span className="sm:hidden">IA</span>
          </Button>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* PANEL IZQUIERDO: Editor (Secciones de contenido) */}
        <div className="w-full lg:w-[45%] xl:w-[40%] overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar bg-muted/5 border-r">
          <GeneralSection isGuest={true} data={profile} onSave={updateProfile} />
          <SummarySection value={profile.summary} onSave={(summary) => updateProfile({ summary })} />
          <ExperienceSection 
            items={profile.experience}
            onAdd={(item) => updateProfile({ experience: [...profile.experience, item] })}
            onUpdate={(item) => updateProfile({ experience: profile.experience.map(e => e.id === item.id ? item : e) })}
            onDelete={(id, name) => openDeleteConfirm('experience', id, name)}
          />
          <EducationSection 
            items={profile.education}
            onAdd={(item) => updateProfile({ education: [...profile.education, item] })}
            onUpdate={(item) => updateProfile({ education: profile.education.map(e => e.id === item.id ? item : e) })}
            onDelete={(id, name) => openDeleteConfirm('education', id, name)}
          />
          <SkillsSection items={profile.skills} onSave={(skills) => updateProfile({ skills })} />
          <SocialLinksSection 
            items={profile.socialLinks}
            onAdd={(item) => updateProfile({ socialLinks: [...profile.socialLinks, item] })}
            onUpdate={(item) => updateProfile({ socialLinks: profile.socialLinks.map(s => s.id === item.id ? item : s) })}
            onDelete={(id, name) => openDeleteConfirm('social', id, name)}
          />
          <ProjectsSection 
            items={profile.projects}
            onAdd={(item) => updateProfile({ projects: [...profile.projects, item] })}
            onUpdate={(item) => updateProfile({ projects: profile.projects.map(p => p.id === item.id ? item : p) })}
            onDelete={(id, name) => openDeleteConfirm('project', id, name)}
          />
          <LanguagesSection 
            items={profile.languages}
            onAdd={(item) => updateProfile({ languages: [...profile.languages, item] })}
            onUpdate={(item) => updateProfile({ languages: profile.languages.map(l => l.id === item.id ? item : l) })}
            onDelete={(id, name) => openDeleteConfirm('language', id, name)}
          />
          <CertificatesSection items={profile.certificates} onSave={(certificates) => updateProfile({ certificates })} />
        </div>

        {/* PANEL DERECHO: Vista Previa */}
        <div className="flex-1 flex flex-col bg-muted/20 relative">
          
          <div className="p-3 border-b flex items-center justify-between bg-card shrink-0">
            <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
              <LayoutPanelLeft className="w-3.5 h-3.5 text-primary" />
              Vista Previa
            </div>
            
            <div className="flex items-center gap-2">
              <Button onClick={handlePreview} disabled={isGenerating} size="sm" className="rounded-lg font-bold gap-2 h-8 text-xs shadow-md">
                {isGenerating ? <RefreshCcw className="w-3 h-3 animate-spin" /> : pdfUrl ? <RefreshCcw className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
                {pdfUrl ? "Actualizar" : "Vista Previa"}
              </Button>
              {pdfUrl && (
                <Button variant="outline" size="sm" className="rounded-lg font-bold gap-2 h-8 text-xs" onClick={() => window.open(pdfUrl, '_blank')}>
                  <Download className="w-3 h-3" /> Descargar
                </Button>
              )}
            </div>
          </div>

          <div className="flex-1 relative overflow-hidden">
            {error && (
              <div className="absolute inset-x-0 top-4 px-4 z-20">
                <Alert variant="destructive" className="rounded-xl shadow-lg py-2"><AlertDescription className="text-xs">{error}</AlertDescription></Alert>
              </div>
            )}

            {isGenerating ? (
              <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10">
                <LoadingScreen fullScreen={false} message="Generando PDF" showLogo={false} />
              </div>
            ) : pdfUrl ? (
              <div className="h-full w-full"><PDFViewer url={pdfUrl} /></div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-4">
                <div className="bg-primary/5 p-6 rounded-full"><Sparkles className="w-12 h-12 text-primary/30" /></div>
                <div className="max-w-xs space-y-1">
                  <h3 className="text-lg font-bold text-foreground">Tu diseño aparecerá aquí</h3>
                  <p className="text-xs text-muted-foreground">Completa tus datos y presiona "Vista Previa" para ver el resultado.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <DeleteConfirmDialog isOpen={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen} onConfirm={handleConfirmDelete} itemName={deleteContext?.name} />
    </div>
  );
};

export default FreeBuilder;
