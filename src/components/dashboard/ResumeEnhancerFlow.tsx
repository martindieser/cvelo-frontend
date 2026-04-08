import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import TailorCV from "@/components/dashboard/TailorCV";
import LoadingScreen from "@/components/LoadingScreen";
import ValidationIntermediary from "@/components/on-boarding/ValidationIntermediary";
import { useTailoredResume } from "@/hooks/useTailoredResume";
import { useUserProfile } from "@/hooks/useUserProfile";
import { UserProfileViewModel, TailoredResumeViewModel } from "@/lib/viewmodels";

interface ResumeEnhancerFlowProps {
  profile: UserProfileViewModel;
  initialJobDescription?: string;
  onComplete?: (resume: any) => void;
  onCancel?: () => void;
  autoStart?: boolean;
}

const ResumeEnhancerFlow = ({ 
  profile, 
  initialJobDescription = "", 
  onComplete,
  onCancel,
  autoStart = false
}: ResumeEnhancerFlowProps) => {
  const navigate = useNavigate();
  const [isStarted, setIsStarted] = useState(autoStart && !!initialJobDescription);
  const [jobDescription, setJobDescription] = useState(initialJobDescription);
  const [hasAutoStarted, setHasAutoStarted] = useState(false);

  const { refreshProfile } = useUserProfile();

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
    clearTailoredResume,
  } = useTailoredResume();

  // Auto-start adaptation if requested
  useEffect(() => {
    if (autoStart && initialJobDescription && !hasAutoStarted) {
      setHasAutoStarted(true);
      handleAdaptCV(initialJobDescription);
    }
  }, [autoStart, initialJobDescription, hasAutoStarted]);

  // Redirigir y notificar al padre cuando el CV esté listo
  useEffect(() => {
    if (tailoredResume) {
      if (onComplete) onComplete(tailoredResume);
      
      // Actualizar créditos en background tras finalizar exitosamente
      setTimeout(() => {
        refreshProfile();
      }, 1000);

      // Siempre navegamos al terminar con éxito
      navigate(`/dashboard/tailor/${tailoredResume.id}`, { replace: true });
    }
  }, [tailoredResume, onComplete, navigate, refreshProfile]);

  const handleAdaptCV = async (description: string) => {
    setIsStarted(true);
    try {
      await generateResume(description);
    } catch (err) {
      console.error("Failed to generate resume", err);
    }
  };

  const handleApprove = async (matches: any) => {
    try {
      await approveResume(matches, profile);
    } catch (err) {
      console.error("Error approving task:", err);
    }
  };

  const handleBackToInput = () => {
    setIsStarted(false);
    clearTailoredResume();
    if (onCancel) onCancel();
  };

  const isLoading = tailoringLoading || (isStarted && !tailoredResume && !tailoringGenerating && !tailoringError);

  // 1. Pantalla Inicial: Formulario de entrada
  if (!isStarted) {
    return (
      <TailorCV 
        onAdapt={handleAdaptCV} 
        description={jobDescription} 
        setDescription={setJobDescription} 
      />
    );
  }

  // 2. Pantalla de Validación: Selección de secciones por el usuario
  if (taskStatus === "AWAITING_APPROVAL" && taskResult) {
    return (
      <div className="flex-1 max-w-2xl mx-auto">
        <ValidationIntermediary 
          profile={profile}
          initialMatches={taskResult.matches}
          jobInfo={taskResult.job}
          onApprove={handleApprove}
          onBack={handleBackToInput}
          isSubmitting={tailoringGenerating}
        />
      </div>
    );
  }

  // 3. Pantalla de Carga: Procesamiento por la IA
  if (tailoringGenerating || isLoading) {
    return (
      <div className="flex-1 min-h-[60vh] flex items-center justify-center">
        <LoadingScreen 
          fullScreen={false} 
          message={
            taskStatus === "PROCESSING" || taskStatus === "PENDING" 
              ? "CVealo está analizando la oferta y adaptando tu CV" 
              : "Generando documento final y PDF"
          } 
        />
      </div>
    );
  }

  // 4. Pantalla de Error
  if (tailoringError) {
    return (
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
            <Button 
              variant="outline" 
              onClick={handleBackToInput}
              className="mt-2 rounded-xl font-bold border-destructive/20 hover:bg-destructive/10 text-destructive h-11 px-6 gap-2"
            >
              <RefreshCcw className="w-4 h-4" /> Intentar de nuevo
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return null;
};

export default ResumeEnhancerFlow;
