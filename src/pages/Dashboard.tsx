import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useLocation, useNavigate, useParams, Outlet } from "react-router-dom";
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
import LoadingScreen from "@/components/LoadingScreen";
import BuyCredits from "@/components/dashboard/BuyCredits";
import { AdaptedResumeViewModel, TailoredResumeViewModel } from "@/lib/viewmodels";
import { useUserProfile } from "@/hooks/useUserProfile";
import { usePayment } from "@/hooks/usePayment";
import { useTailoredResume } from "@/hooks/useTailoredResume";
import { useResumes } from "@/hooks/useResumes";

const Dashboard = () => {
  const { resumeId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Derivar activeTab de la ruta
  const activeTab = useMemo(() => {
    const path = location.pathname;
    if (path.includes("/info")) return "info";
    if (path.includes("/docs")) return "docs";
    if (path.includes("/settings")) return "settings";
    return "tailor";
  }, [location.pathname]);

  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [docsPage, setDocsPage] = useState(1);
  const [activeHighlight, setActiveHighlight] = useState<string | null>(null);
  const [isViewingSpecificDoc, setIsViewingSpecificDoc] = useState(false);
  
  const [currentTailoredResume, setCurrentTailoredResume] = useState<TailoredResumeViewModel | null>(null);

  const { profile, loading: profileLoading, updateProfile, refreshProfile } = useUserProfile();
  const { resumes, loading: resumesLoading, deleteResume, updateResume, refreshResumes } = useResumes();
  const { status: paymentStatus } = usePayment();
  const { fetchTailoredResume, clearTailoredResume, loading: tailoringLoading } = useTailoredResume();
  
  // Escuchar evento global para abrir el modal de precios
  useEffect(() => {
    const handleOpenPricing = () => setIsPricingOpen(true);
    window.addEventListener("open-pricing-modal", handleOpenPricing);
    return () => window.removeEventListener("open-pricing-modal", handleOpenPricing);
  }, []);

  // Cargar documento si hay un resumeId en la URL
  useEffect(() => {
    const loadResume = async () => {
      if (resumeId && profile) {
        setIsViewingSpecificDoc(true);
        try {
          const resume = await fetchTailoredResume(resumeId, profile);
          setCurrentTailoredResume(resume);
        } catch (err) {
          console.error("Failed to fetch resume", err);
          navigate("/dashboard/docs"); // Redirigir si falla
        }
      } else if (!resumeId) {
        setIsViewingSpecificDoc(false);
        setCurrentTailoredResume(null);
        clearTailoredResume();
      }
    };
    loadResume();
  }, [resumeId, profile]);
  
  const isAwaitingPayment = paymentStatus === "awaiting_payment";
  const finalPricingOpen = isPricingOpen || isAwaitingPayment;

  const handleViewDocument = (doc: AdaptedResumeViewModel) => {
    navigate(`/dashboard/tailor/${doc.id}`);
  };

  const handleNewAdapt = () => {
    navigate("/dashboard/tailor");
  };

  const handleBackToTailor = () => {
    navigate("/dashboard/docs");
  };

  if (profileLoading) return <LoadingScreen message="Cargando tu perfil..." />;

  const isTailoredView = isViewingSpecificDoc || !!currentTailoredResume;

  return (
    <div className="flex h-screen bg-background overflow-hidden font-body">
      <DashboardSidebar 
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
            <Outlet context={{
              profile,
              updateProfile,
              refreshProfile,
              resumes,
              resumesLoading,
              deleteResume,
              updateResume,
              refreshResumes,
              handleViewDocument,
              handleBackToTailor,
              currentTailoredResume,
              setCurrentTailoredResume,
              tailoringLoading,
              isViewingSpecificDoc,
              activeHighlight,
              setActiveHighlight,
              docsPage,
              setDocsPage,
              clearTailoredResume
            }} />
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
