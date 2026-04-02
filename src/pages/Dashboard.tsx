import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
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
import PersonalInfo from "@/components/dashboard/PersonalInfo";
import MyDocuments from "@/components/dashboard/MyDocuments";
import Settings from "@/components/dashboard/Settings";
import LoadingScreen from "@/components/LoadingScreen";
import BuyCredits from "@/components/dashboard/BuyCredits";
import ResumeEnhancerFlow from "@/components/dashboard/ResumeEnhancerFlow";
import ResumePreview from "@/components/dashboard/ResumePreview";
import InsightsPanel from "@/components/dashboard/InsightsPanel";
import { AdaptedResumeViewModel, TailoredResumeViewModel } from "@/lib/viewmodels";
import { useUserProfile } from "@/hooks/useUserProfile";
import { usePayment } from "@/hooks/usePayment";
import { useTailoredResume } from "@/hooks/useTailoredResume";

const Dashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const resumeIdParam = searchParams.get("resumeId");

  const [activeTab, setActiveTab] = useState("tailor");
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [docsPage, setDocsPage] = useState(1);
  const [activeHighlight, setActiveHighlight] = useState<string | null>(null);
  const [isViewingSpecificDoc, setIsViewingSpecificDoc] = useState(false);
  
  const [currentTailoredResume, setCurrentTailoredResume] = useState<TailoredResumeViewModel | null>(null);

  const { profile, loading: profileLoading } = useUserProfile();
  const { status: paymentStatus } = usePayment();
  const { fetchTailoredResume, clearTailoredResume, loading: tailoringLoading } = useTailoredResume();
  
  useEffect(() => {
    if (resumeIdParam && profile) {
      handleViewDocument({ id: resumeIdParam } as AdaptedResumeViewModel);
      setSearchParams({}, { replace: true });
    }
  }, [resumeIdParam, profile]);
  
  const isAwaitingPayment = paymentStatus === "awaiting_payment";
  const finalPricingOpen = isPricingOpen || isAwaitingPayment;

  const handleViewDocument = async (doc: AdaptedResumeViewModel) => {
    if (!profile) return;
    setIsViewingSpecificDoc(true);
    setActiveTab("tailor"); 
    try {
      const resume = await fetchTailoredResume(doc.id, profile);
      setCurrentTailoredResume(resume);
    } catch (err) {
      console.error("Failed to fetch resume", err);
    }
  };

  const handleNewAdapt = () => {
    setIsViewingSpecificDoc(false);
    setCurrentTailoredResume(null);
    clearTailoredResume();
    setActiveTab("tailor");
  };

  const handleBackToTailor = () => {
    if (isViewingSpecificDoc) {
      setActiveTab("docs");
    }
    setIsViewingSpecificDoc(false);
    setCurrentTailoredResume(null);
    clearTailoredResume();
  };

  if (profileLoading) return <LoadingScreen message="Cargando tu perfil..." />;

  const isTailoredView = isViewingSpecificDoc || !!currentTailoredResume;

  return (
    <div className="flex h-screen bg-background overflow-hidden font-body">
      <DashboardSidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          // Solo reseteamos si cambiamos a una pestaña que NO sea tailor
          if (tab !== "tailor") {
            setIsViewingSpecificDoc(false);
            setCurrentTailoredResume(null);
            clearTailoredResume();
          }
        }} 
        onPricingClick={() => setIsPricingOpen(true)}
      />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-muted/20">
        <DashboardHeader 
          onAvatarClick={() => setIsAvatarDialogOpen(true)} 
          activeTab={activeTab}
          isTailored={isTailoredView}
          onNewAdapt={handleNewAdapt}
        />

        <div className="flex-1 overflow-y-auto p-2 lg:p-8">
          <div className="max-w-[1600px] mx-auto">
            
            {/* SECCIÓN TAILOR / ADAPTACIÓN */}
            <div className={activeTab === "tailor" ? "block" : "hidden"}>
              {currentTailoredResume ? (
                <div className="flex flex-col xl:flex-row gap-4 lg:gap-8 w-full animate-in fade-in duration-500">
                  <ResumePreview 
                    onBack={handleBackToTailor} 
                    data={currentTailoredResume}
                    activeHighlight={activeHighlight}
                    onHighlightClick={setActiveHighlight}
                  />
                  <InsightsPanel 
                    keywords={currentTailoredResume.detectedKeywords} 
                    changes={currentTailoredResume.appliedChanges} 
                    activeHighlight={activeHighlight}
                    onHighlightClick={setActiveHighlight}
                  />
                </div>
              ) : tailoringLoading || (isViewingSpecificDoc && !currentTailoredResume) ? (
                <div className="flex-1 min-h-[60vh] flex items-center justify-center">
                  <LoadingScreen fullScreen={false} message="Cargando documento..." />
                </div>
              ) : profile ? (
                <ResumeEnhancerFlow 
                  profile={profile} 
                  onComplete={(resume) => setCurrentTailoredResume(resume)}
                />
              ) : null}
            </div>

            {/* SECCIÓN INFORMACIÓN PERSONAL */}
            <div className={activeTab === "info" ? "block" : "hidden"}>
              <PersonalInfo />
            </div>

            {/* SECCIÓN MIS DOCUMENTOS - PERSISTENTE */}
            <div className={activeTab === "docs" ? "block" : "hidden"}>
              <MyDocuments onView={handleViewDocument} currentPage={docsPage} onPageChange={setDocsPage} />
            </div>

            {/* SECCIÓN CONFIGURACIÓN */}
            <div className={activeTab === "settings" ? "block" : "hidden"}>
              <Settings />
            </div>

            {/* OTRAS SECCIONES */}
            {activeTab !== "tailor" && activeTab !== "info" && activeTab !== "docs" && activeTab !== "settings" && (
              <div className="flex-1 flex items-center justify-center h-[60vh] text-muted-foreground border-2 border-dashed border-border rounded-3xl">
                Sección {activeTab} en desarrollo...
              </div>
            )}
            
          </div>
          
          <div className="h-20 lg:hidden" />
        </div>
      </main>

      {/* PRICING DIALOG */}
      <Dialog 
        open={finalPricingOpen} 
        onOpenChange={(open) => {
          if (!isAwaitingPayment) setIsPricingOpen(open);
        }}
      >
        <DialogContent 
          className="rounded-3xl w-[90vw] max-w-[360px] p-6 shadow-2xl"
          onPointerDownOutside={(e) => isAwaitingPayment && e.preventDefault()}
          onEscapeKeyDown={(e) => isAwaitingPayment && e.preventDefault()}
        >
          <DialogHeader className="pb-2">
            <DialogTitle className="text-xl font-black text-center">Comprar Créditos</DialogTitle>
          </DialogHeader>
          <BuyCredits onClose={() => setIsPricingOpen(false)} />
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
