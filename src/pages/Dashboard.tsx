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
import TailorCV from "@/components/dashboard/TailorCV";
import PersonalInfo from "@/components/dashboard/PersonalInfo";
import MyDocuments from "@/components/dashboard/MyDocuments";
import Settings from "@/components/dashboard/Settings";
import BuyCredits from "@/components/dashboard/BuyCredits";
import EnhanceResumeFlow from "@/components/dashboard/EnhanceResumeFlow";
import { AdaptedResumeViewModel } from "@/lib/viewmodels";
import { useUserProfile } from "@/hooks/useUserProfile";
import { usePayment } from "@/hooks/usePayment";

const Dashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const resumeIdParam = searchParams.get("resumeId");

  const [activeTab, setActiveTab] = useState("tailor");
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isTailored, setIsTailored] = useState(false);
  const [existingResumeId, setExistingResumeId] = useState<string | null>(null);
  const [docsPage, setDocsPage] = useState(1);
  const [jobDescription, setJobDescription] = useState("");

  const { profile } = useUserProfile();
  const { status: paymentStatus } = usePayment();
  
  // Efecto para cargar automáticamente un CV desde la URL (Onboarding flow)
  useEffect(() => {
    if (resumeIdParam && profile) {
      setExistingResumeId(resumeIdParam);
      setIsTailored(true);
      // Limpiamos el parámetro para que no se recargue al navegar
      setSearchParams({}, { replace: true });
    }
  }, [resumeIdParam, profile]);
  
  // Force dialog open if payment is pending
  const isAwaitingPayment = paymentStatus === "awaiting_payment";
  const finalPricingOpen = isPricingOpen || isAwaitingPayment;

  const handleAdaptCV = (description: string) => {
    if (!profile) return;
    setJobDescription(description);
    setExistingResumeId(null);
    setIsTailored(true);
  };

  const handleViewDocument = (doc: AdaptedResumeViewModel) => {
    if (!profile) return;
    setExistingResumeId(doc.id);
    setIsTailored(true);
  };

  const handleBackToMain = () => {
    setIsTailored(false);
    setExistingResumeId(null);
  };

  const handleNewAdapt = () => {
    setIsTailored(false);
    setExistingResumeId(null);
    setJobDescription("");
    setActiveTab("tailor");
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden font-body">
      {/* SIDEBAR */}
      <DashboardSidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          // Si cambiamos de pestaña manualmente, cerramos la vista de un CV específico
          setIsTailored(false);
          setExistingResumeId(null);
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
            
            {isTailored && profile ? (
              <EnhanceResumeFlow 
                jobDescription={jobDescription}
                profile={profile}
                onBack={handleBackToMain}
                existingResumeId={existingResumeId}
              />
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
