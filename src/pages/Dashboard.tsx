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
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ResumePreview from "@/components/dashboard/ResumePreview";
import InsightsPanel from "@/components/dashboard/InsightsPanel";
import TailorCV from "@/components/dashboard/TailorCV";
import PersonalInfo from "@/components/dashboard/PersonalInfo";
import MyDocuments from "@/components/dashboard/MyDocuments";
import Settings from "@/components/dashboard/Settings";
import LoadingScreen from "@/components/LoadingScreen";
import BuyCredits from "@/components/dashboard/BuyCredits";
import { AdaptedResumeViewModel } from "@/lib/viewmodels";
import { useUserProfile } from "@/hooks/useUserProfile";
import { usePayment } from "@/hooks/usePayment";
import { useTailoredResume } from "@/hooks/useTailoredResume";
import ValidationIntermediary from "@/components/on-boarding/ValidationIntermediary";

const Dashboard = () => {
// ... existing code ...
  const [searchParams, setSearchParams] = useSearchParams();
  const resumeIdParam = searchParams.get("resumeId");

  const [activeTab, setActiveTab] = useState("tailor");
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isTailored, setIsTailored] = useState(false);
  const [activeHighlight, setActiveHighlight] = useState<string | null>(null);
  const [docsPage, setDocsPage] = useState(1);
  const [jobDescription, setJobDescription] = useState("");

  const { profile, loading: profileLoading } = useUserProfile();
  const { status: paymentStatus } = usePayment();
  
  // Efecto para cargar automáticamente un CV desde la URL (Onboarding flow)
  useEffect(() => {
    if (resumeIdParam && profile) {
      handleViewDocument({ id: resumeIdParam } as AdaptedResumeViewModel);
      // Limpiamos el parámetro para que no se recargue al navegar
      setSearchParams({}, { replace: true });
    }
  }, [resumeIdParam, profile]);
  
  // Force dialog open if payment is pending
  const isAwaitingPayment = paymentStatus === "awaiting_payment";
  const finalPricingOpen = isPricingOpen || isAwaitingPayment;

  const { 
    tailoredResume, 
    generating: tailoringGenerating, 
    loading: tailoringLoading,
    error: tailoringError,
    currentTaskId,
    taskStatus,
    taskResult,
    generateResume, 
    approveResume,
    fetchTailoredResume,
    clearTailoredResume,
    clearError
  } = useTailoredResume();

  const handleAdaptCV = async (description: string) => {
    if (!profile) return;
    setIsTailored(true); // Mostrar pantalla de carga/vista previa inmediatamente
    try {
      await generateResume(description);
    } catch (err) {
      console.error("Failed to generate resume", err);
    }
  };

  const handleApprove = async (matches: any) => {
    if (!profile) return;
    try {
      await approveResume(matches, profile);
    } catch (err) {
      console.error("Error approving task:", err);
    }
  };

  const handleViewDocument = async (doc: AdaptedResumeViewModel) => {
    if (!profile) return;
    setIsTailored(true); // Mostrar pantalla de carga inmediatamente
    try {
      await fetchTailoredResume(doc.id, profile);
    } catch (err) {
      console.error("Failed to fetch resume", err);
      // No ponemos isTailored en false aquí para permitir que se muestre el error en la UI
    }
  };

  const handleBackToTailor = () => {
    setIsTailored(false);
    clearTailoredResume();
  };

  const handleNewAdapt = () => {
    setIsTailored(false);
    clearTailoredResume();
    setActiveTab("tailor");
  };

  const isLoading = tailoringLoading || (isTailored && !tailoredResume && !tailoringGenerating && !tailoringError);

  return (
    <div className="flex h-screen bg-background overflow-hidden font-body">
      {/* SIDEBAR */}
      <DashboardSidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          // Si cambiamos de pestaña manualmente, cerramos la vista de un CV específico
          setIsTailored(false);
          clearTailoredResume();
        }} 
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
        <div className="flex-1 overflow-y-auto p-2 lg:p-8">
          <div className="max-w-[1600px] mx-auto flex flex-col xl:flex-row gap-4 lg:gap-8">
            
            {isTailored ? (
              taskStatus === "AWAITING_APPROVAL" && profile && taskResult ? (
                <div className="flex-1 max-w-2xl mx-auto">
                  <ValidationIntermediary 
                    profile={profile}
                    initialMatches={taskResult.matches}
                    jobInfo={taskResult.job}
                    onApprove={handleApprove}
                    onBack={handleBackToTailor}
                    isSubmitting={tailoringGenerating}
                  />
                </div>
              ) : tailoringGenerating || isLoading ? (
                <LoadingScreen 
                  fullScreen={false} 
                  message={
                    taskStatus === "PROCESSING" || taskStatus === "PENDING" 
                      ? "CVealo está analizando la oferta y adaptando tu CV" 
                      : "Generando documento final y PDF"
                  } 
                />
              ) : tailoringError ? (
                <div className="flex-1 max-w-2xl mx-auto py-12">
                  <Alert variant="destructive" className="rounded-2xl border-destructive/20 bg-destructive/5 p-6">
                    <AlertCircle className="h-6 w-6" />
                    <AlertTitle className="text-lg font-bold ml-2">Error al adaptar CV</AlertTitle>
                    <AlertDescription className="mt-4 space-y-4">
                      <p className="text-base">
                        {tailoringError}
                      </p>
                      <div className="bg-background/50 p-4 rounded-xl border border-destructive/10">
                        <p className="text-xs font-bold uppercase tracking-wider opacity-70">ID de la tarea:</p>
                        <p className="font-mono text-sm break-all">{currentTaskId || "No disponible"}</p>
                      </div>
                      <p className="text-sm opacity-80">
                        Por favor, contacta al administrador del sitio con el ID de la tarea mencionado arriba para que podamos ayudarte.
                      </p>
                      <Button 
                        variant="outline" 
                        onClick={handleNewAdapt}
                        className="mt-2 rounded-xl font-bold border-destructive/20 hover:bg-destructive/10 text-destructive h-11 px-6 gap-2"
                      >
                        <RefreshCcw className="w-4 h-4" /> Intentar de nuevo
                      </Button>
                    </AlertDescription>
                  </Alert>
                </div>
              ) : tailoredResume ? (
                <>
                  {/* CENTRAL RESUME VIEW */}
                  <ResumePreview 
                    onBack={handleBackToTailor} 
                    data={tailoredResume}
                    activeHighlight={activeHighlight}
                    onHighlightClick={setActiveHighlight}
                  />

                  {/* RIGHT PANEL */}
                  <InsightsPanel 
                    keywords={tailoredResume.detectedKeywords} 
                    changes={tailoredResume.appliedChanges} 
                    activeHighlight={activeHighlight}
                    onHighlightClick={setActiveHighlight}
                  />
                </>
              ) : null
            ) : activeTab === "tailor" ? (
              <TailorCV 
                onAdapt={handleAdaptCV} 
                description={jobDescription} 
                setDescription={setJobDescription} 
              />
            ) : activeTab === "info" ? (
              <PersonalInfo />
            ) : activeTab === "docs" ? (
              <MyDocuments onView={handleViewDocument} currentPage={docsPage} onPageChange={setDocsPage} />
            ) : activeTab === "settings" ? (
              <Settings />
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
