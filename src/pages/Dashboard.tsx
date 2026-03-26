import { useState } from "react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ResumePreview from "@/components/dashboard/ResumePreview";
import InsightsPanel from "@/components/dashboard/InsightsPanel";
import TailorCV from "@/components/dashboard/TailorCV";
import PersonalInfo from "@/components/dashboard/PersonalInfo";
import MyDocuments from "@/components/dashboard/MyDocuments";
import Settings from "@/components/dashboard/Settings";
import BuyCredits from "@/components/dashboard/BuyCredits";
import { UserProfileViewModel, TailoredResumeViewModel, UserSettingsViewModel, AdaptedResumeViewModel } from "@/lib/viewmodels";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("tailor");
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isTailored, setIsTailored] = useState(false);

  // Perfil por defecto (Master Data)
  const [profile, setProfile] = useState<UserProfileViewModel>({
    name: "Juan Pérez",
    email: "juan.perez@email.com",
    location: "Madrid, España",
    phone: "+34 600 000 000",
    summary: "Cuento con más de 2 años de experiencia en atención al cliente, manejo de POS y uso básico de computadoras de escritorio, donde cumplí procesos definidos con puntualidad y responsabilidad. Busco iniciar mi trayectoria en ingeniería de software y estoy dispuesto a aprender sobre desarrollo en la nube, programación, APIs y herramientas de monitoreo para aportar en entornos dinámicos y desafiantes.",
    skills: ["React", "TypeScript", "Node.js", "SQL", "Git", "Customer Service", "POS Management"],
    socialLinks: [
      { id: "1", platform: "LinkedIn", url: "https://linkedin.com/in/juanperez" },
      { id: "2", platform: "Portfolio", url: "https://juanperez.dev" }
    ],
    experience: [
      { 
        id: "1", 
        role: "Cajero", 
        company: "Large Ducks Coffee", 
        period: "Junio 2023 – Actualidad",
        details: "Operé la caja registradora POS para cobrar a clientes y entregar cambio con precisión mientras preparaba alimentos y bebidas.\nManejé horarios de alta demanda mediante la multitarea y un servicio al cliente consistente.\nUtilicé una computadora de escritorio para gestionar correo electrónico interno y completar capacitaciones en línea."
      }
    ],
    education: [
      { id: "1", degree: "Bachillerato", institution: "Instituto Tecnológico", period: "2019 - 2021" }
    ],
    languages: [
      { id: "1", name: "Español", level: "Nativo" },
      { id: "2", name: "Inglés", level: "B2 - Intermedio Alto" }
    ],
    certificates: ["Certificado de Atención al Cliente", "Google Cloud Digital Leader"],
    settings: {
      language: "auto",
      tone: "professional",
      template: "modern",
      sectionsOrder: [
        { id: "resumen", name: "Resumen" },
        { id: "experiencia", name: "Experiencia" },
        { id: "educacion", name: "Educación" },
        { id: "skills", name: "Habilidades" },
        { id: "lenguajes", name: "Idiomas" },
        { id: "certificados", name: "Certificados" },
      ]
    },
    adaptedResumes: [
      { id: "1", companyName: "Mercado Libre", resumeName: "CV Frontend Dev - ML", date: "24/03/2026" },
    ]
  });

  // Estado para el CV adaptado (ViewModel completo)
  const [tailoredData, setTailoredData] = useState<TailoredResumeViewModel>({
    id: "1",
    jobName: "Frontend Developer",
    companyName: "Mercado Libre",
    date: "24/03/2026",
    optimizedSummary: "Cajero con experiencia en atención al cliente y gestión operativa, buscando iniciar mi carrera como Frontend Developer. Poseo conocimientos sólidos en React, TypeScript y APIs. Mi enfoque se centra en la eficiencia y la resolución de problemas técnicos en entornos de alto rendimiento.",
    optimizedExperience: [
      { 
        id: "1", 
        role: "Cajero (Enfoque en Procesos Técnicos)", 
        company: "Large Ducks Coffee", 
        period: "Junio 2023 – Actualidad",
        details: "Gestioné transacciones complejas utilizando sistemas POS, optimizando el tiempo de respuesta al cliente.\nColaboré en la resolución de incidencias técnicas básicas del sistema de ventas.\nUtilicé herramientas digitales internas para la gestión de inventario y comunicación corporativa."
      }
    ],
    optimizedSkills: ["React", "TypeScript", "Node.js", "Tailwind CSS", "APIs", "Git", "Agile"],
    optimizedEducation: [
      { id: "1", degree: "Bachillerato (Orientación Tecnológica)", institution: "Instituto Tecnológico", period: "2019 - 2021" }
    ],
    optimizedLanguages: [
      { id: "1", name: "Español", level: "Nativo" },
      { id: "2", name: "Inglés", level: "B2 - Técnico" }
    ],
    optimizedCertificates: ["Google Cloud Digital Leader", "Certificado de Desarrollo Web"],
    detectedKeywords: ["React", "TypeScript", "APIs", "Eficiencia", "Frontend"],
    appliedChanges: [
      { section: "Resumen", description: "Se reenfocó el resumen para destacar el interés en Frontend y mencionar habilidades técnicas clave." },
      { section: "Experiencia", description: "Se ajustaron los logros en Large Ducks para resaltar el manejo de sistemas y procesos técnicos." },
      { section: "Habilidades", description: "Se priorizaron las tecnologías web y se añadieron metodologías ágiles relevantes para el puesto." }
    ],
    baseProfile: profile
  });

  const handleAdaptCV = (description: string) => {
    console.log("Adaptando CV con descripción:", description);
    setTailoredData({
      ...tailoredData,
      jobName: "Nuevo Puesto Adaptado",
      companyName: "Empresa Destino"
    });
    setIsTailored(true);
  };

  const handleViewDocument = (doc: AdaptedResumeViewModel) => {
    setTailoredData({
      ...tailoredData,
      id: doc.id,
      companyName: doc.companyName,
      jobName: doc.resumeName
    });
    setIsTailored(true);
    setActiveTab("tailor");
  };

  const handleBackToTailor = () => {
    setIsTailored(false);
  };

  const handleNewAdapt = () => {
    setIsTailored(false);
    setActiveTab("tailor");
  };

  const handleSaveSettings = (newSettings: UserSettingsViewModel) => {
    setProfile(prev => ({
      ...prev,
      settings: newSettings
    }));
    console.log("Settings actualizadas en el perfil global:", newSettings);
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden font-body">
      {/* SIDEBAR */}
      <DashboardSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onPricingClick={() => setIsPricingOpen(true)}
      />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-muted/20">
        <DashboardHeader 
          onAvatarClick={() => setIsAvatarDialogOpen(true)} 
          activeTab={activeTab}
          isTailored={isTailored}
          onNewAdapt={handleNewAdapt}
        />

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-[1600px] mx-auto flex flex-col xl:flex-row gap-8">
            
            {activeTab === "tailor" ? (
              !isTailored ? (
                <TailorCV onAdapt={handleAdaptCV} />
              ) : (
                <>
                  {/* CENTRAL RESUME VIEW */}
                  <ResumePreview 
                    onBack={handleBackToTailor} 
                    data={tailoredData}
                  />

                  {/* RIGHT PANEL */}
                  <InsightsPanel 
                    keywords={tailoredData.detectedKeywords} 
                    changes={tailoredData.appliedChanges} 
                  />
                </>
              )
            ) : activeTab === "info" ? (
              <PersonalInfo />
            ) : activeTab === "docs" ? (
              <MyDocuments 
                initialDocuments={profile.adaptedResumes} 
                onView={handleViewDocument} 
              />
            ) : activeTab === "settings" ? (
              <Settings 
                settings={profile.settings} 
                onSave={handleSaveSettings} 
              />
            ) : (
              <div className="flex-1 flex items-center justify-center h-[60vh] text-muted-foreground border-2 border-dashed border-border rounded-3xl">
                Sección {activeTab} en desarrollo...
              </div>
            )}
            
          </div>
          
          <div className="h-20 lg:hidden" />
        </div>
      </main>

      {/* PRICING DIALOG */}
      <Dialog open={isPricingOpen} onOpenChange={setIsPricingOpen}>
        <DialogContent className="rounded-3xl w-[90vw] max-w-[360px] p-6 shadow-2xl">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-xl font-black text-center">Comprar Créditos</DialogTitle>
          </DialogHeader>
          <BuyCredits />
        </DialogContent>
      </Dialog>

      {/* SHARED DIALOGS */}
      <AlertDialog open={isAvatarDialogOpen} onOpenChange={setIsAvatarDialogOpen}>
        <AlertDialogContent className="rounded-2xl border-border w-[90vw] max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold">¿Deseas agregar una foto?</AlertDialogTitle>
            <div className="text-muted-foreground space-y-4 pt-2 text-sm lg:text-base">
              <p>
                Al subir una foto, esta se guardará en tu perfil y se incluirá automáticamente en tus **próximas generaciones de currículums**.
              </p>
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-800 text-sm">
                <span className="font-bold">Nota importante:</span> El uso de fotografía en un CV depende del mercado (país) y la industria a la que aplique. En algunos mercados (como EE.UU. o UK) no es recomendable.
              </div>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 mt-4 flex-col sm:flex-row">
            <AlertDialogCancel className="rounded-xl font-bold border-border w-full sm:w-auto">Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              className="rounded-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto"
              onClick={() => {
                setIsAvatarDialogOpen(false);
                setTimeout(() => {
                  document.getElementById('avatar-upload')?.click();
                }, 100);
              }}
            >
              Entendido, elegir foto
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Hidden inputs */}
      <input 
        type="file" 
        id="avatar-upload" 
        className="hidden" 
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) console.log("Foto seleccionada:", file.name);
        }}
      />
    </div>
  );
};

export default Dashboard;
