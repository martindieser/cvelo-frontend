import { FileText, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import LoadingScreen from "@/components/LoadingScreen";
import EnhanceResumeFlow from "@/components/dashboard/EnhanceResumeFlow";
import { UserProfileDTO } from "@/lib/dtos";
import { UserProfileViewModel } from "@/lib/viewmodels";

interface StepFinalProcessProps {
  apiStatus: string;
  apiError: string | null;
  onRetry: () => void;
  onBack?: () => void;
  onComplete?: (resumeId: string) => void;
  extractedProfile?: UserProfileDTO | null;
  jobDescription?: string;
}

const StepFinalProcess = ({ 
  apiStatus, 
  apiError, 
  onRetry, 
  onBack,
  onComplete,
  extractedProfile,
  jobDescription
}: StepFinalProcessProps) => {
  // Cuando ya tenemos el perfil extraído, le pasamos el control a EnhanceResumeFlow
  if (apiStatus === "completed" && extractedProfile && jobDescription) {
    return (
      <EnhanceResumeFlow 
        jobDescription={jobDescription}
        profile={extractedProfile as any as UserProfileViewModel} // El DTO y ViewModel de profile son compatibles para visualización
        onBack={onBack!} // Se marca como requerido en EnhanceResumeFlow pero si es undefined no mostrará el botón
        onComplete={onComplete}
        showFinalPreview={false} // En onboarding no queremos la preview final aquí, sino redirigir
      />
    );
  }

  return (
    <div className="py-12 text-center space-y-8">
      {apiStatus === "error" ? (
        <div className="space-y-6">
          <div className="bg-destructive/10 w-24 h-24 rounded-full flex items-center justify-center text-destructive mx-auto">
            <FileText className="w-12 h-12" />
          </div>
          <h3 className="text-2xl font-black">Algo no salió bien</h3>
          {apiError && (
            <Alert variant="destructive" className="max-w-md mx-auto rounded-2xl border-none bg-destructive/5">
              <AlertCircle className="h-4 w-4 mr-2" />
              <AlertDescription className="font-medium">{apiError}</AlertDescription>
            </Alert>
          )}
          <Button onClick={onRetry} variant="outline" className="mt-4 rounded-xl font-bold px-8">
            Volver a intentar
          </Button>
        </div>
      ) : (
        <LoadingScreen 
          fullScreen={false} 
          message="Analizando tu perfil para extraer tus habilidades..." 
        />
      )}
    </div>
  );
};

export default StepFinalProcess;
