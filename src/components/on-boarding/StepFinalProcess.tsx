import { FileText, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import LoadingScreen from "@/components/LoadingScreen";
import ValidationIntermediary from "./ValidationIntermediary";
import { UserProfileDTO, MatchesDTO } from "@/lib/dtos";

interface StepFinalProcessProps {
  apiStatus: string;
  apiError: string | null;
  onRetry: () => void;
  onBack?: () => void;
  extractedProfile?: UserProfileDTO | null;
  taskResult?: any;
  onApprove?: (matches: MatchesDTO) => void;
}

const StepFinalProcess = ({ 
  apiStatus, 
  apiError, 
  onRetry, 
  onBack,
  extractedProfile, 
  taskResult,
  onApprove 
}: StepFinalProcessProps) => {
  if (apiStatus === "awaiting_approval" && extractedProfile && taskResult && onApprove) {
    return (
      <ValidationIntermediary 
        profile={extractedProfile}
        initialMatches={taskResult.matches}
        jobInfo={taskResult.job}
        onApprove={onApprove}
        onBack={onBack}
        isSubmitting={apiStatus === "enhancing"} 
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
          message={
            apiStatus === "processing" ? "Analizando perfil y avisos..." : 
            apiStatus === "enhancing" ? "Redactando CV optimizado y generando PDF..." : 
            apiStatus === "completed" ? "¡Éxito! Redirigiendo" :
            "Preparando documentos"
          } 
        />
      )}
    </div>
  );
};

export default StepFinalProcess;
