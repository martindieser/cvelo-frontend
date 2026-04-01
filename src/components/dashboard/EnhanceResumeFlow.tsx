import { useState, useEffect } from "react";
import { useTailoredResume } from "@/hooks/useTailoredResume";
import { UserProfileViewModel } from "@/lib/viewmodels";
import LoadingScreen from "@/components/LoadingScreen";
import ValidationIntermediary from "@/components/on-boarding/ValidationIntermediary";
import ResumePreview from "@/components/dashboard/ResumePreview";
import InsightsPanel from "@/components/dashboard/InsightsPanel";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCcw } from "lucide-react";

interface EnhanceResumeFlowProps {
  jobDescription: string;
  profile: UserProfileViewModel;
  onBack: () => void;
  // Opcional: si queremos pasar un ID de un resume ya existente para solo visualizarlo
  existingResumeId?: string | null;
}

export default function EnhanceResumeFlow({ 
  jobDescription, 
  profile, 
  onBack,
  existingResumeId = null
}: EnhanceResumeFlowProps) {
  const [activeHighlight, setActiveHighlight] = useState<string | null>(null);
  
  const { 
    tailoredResume, 
    generating, 
    loading,
    error,
    currentTaskId,
    taskStatus,
    taskResult,
    generateResume, 
    approveResume,
    fetchTailoredResume,
    clearTailoredResume
  } = useTailoredResume();

  // Iniciar el proceso al montar el componente
  useEffect(() => {
    if (existingResumeId) {
      fetchTailoredResume(existingResumeId, profile);
    } else if (jobDescription) {
      generateResume(jobDescription);
    }
    
    return () => clearTailoredResume();
  }, [jobDescription, existingResumeId]);

  const handleApprove = async (matches: any) => {
    try {
      await approveResume(matches, profile);
    } catch (err) {
      console.error("Error approving task:", err);
    }
  };

  const handleRetry = () => {
    if (jobDescription) {
      generateResume(jobDescription);
    }
  };

  // 1. Estado de Error
  if (error) {
    return (
      <div className="flex-1 max-w-2xl mx-auto py-12">
        <Alert variant="destructive" className="rounded-2xl border-destructive/20 bg-destructive/5 p-6">
          <AlertCircle className="h-6 w-6" />
          <AlertTitle className="text-lg font-bold ml-2">Error al adaptar CV</AlertTitle>
          <AlertDescription className="mt-4 space-y-4">
            <p className="text-base">{error}</p>
            <div className="bg-background/50 p-4 rounded-xl border border-destructive/10 text-left">
              <p className="text-xs font-bold uppercase tracking-wider opacity-70">ID de la tarea:</p>
              <p className="font-mono text-sm break-all">{currentTaskId || "No disponible"}</p>
            </div>
            <Button 
              variant="outline" 
              onClick={handleRetry}
              className="mt-2 rounded-xl font-bold border-destructive/20 hover:bg-destructive/10 text-destructive h-11 px-6 gap-2"
            >
              <RefreshCcw className="w-4 h-4" /> Intentar de nuevo
            </Button>
            <Button variant="ghost" onClick={onBack} className="block w-full mt-2">
              Volver atrás
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // 2. Estado de Validación (Awaiting Approval)
  if (taskStatus === "AWAITING_APPROVAL" && taskResult) {
    return (
      <div className="flex-1 max-w-2xl mx-auto">
        <ValidationIntermediary 
          profile={profile}
          initialMatches={taskResult.matches}
          jobInfo={taskResult.job}
          onApprove={handleApprove}
          onBack={onBack}
          isSubmitting={generating}
        />
      </div>
    );
  }

  // 3. Estado de Carga (Análisis o Generación)
  const isCurrentlyGenerating = generating || (taskStatus !== "COMPLETED" && taskStatus !== "AWAITING_APPROVAL" && !tailoredResume);
  if (isCurrentlyGenerating || loading) {
    return (
      <LoadingScreen 
        fullScreen={false} 
        message={
          taskStatus === "PROCESSING" || taskStatus === "PENDING" 
            ? "CurriAI está analizando la oferta y adaptando tu CV" 
            : "Generando documento final y PDF"
        } 
      />
    );
  }

  // 4. Resultado Final (Resume Preview + Insights)
  if (tailoredResume) {
    return (
      <div className="flex flex-col xl:flex-row gap-4 lg:gap-8 w-full">
        <ResumePreview 
          onBack={onBack} 
          data={tailoredResume}
          activeHighlight={activeHighlight}
          onHighlightClick={setActiveHighlight}
        />

        <InsightsPanel 
          keywords={tailoredResume.detectedKeywords} 
          changes={tailoredResume.appliedChanges} 
          activeHighlight={activeHighlight}
          onHighlightClick={setActiveHighlight}
        />
      </div>
    );
  }

  return null;
}
