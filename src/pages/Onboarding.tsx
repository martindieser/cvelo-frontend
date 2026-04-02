import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { useOnboardingProcess } from "@/hooks/useOnboardingProcess";

// Sub-componentes refactorizados
import StepUpload from "@/components/on-boarding/StepUpload";
import StepJobDescription from "@/components/on-boarding/StepJobDescription";
import StepAuth from "@/components/on-boarding/StepAuth";
import ResumeEnhancerFlow from "@/components/dashboard/ResumeEnhancerFlow";
import Settings from "@/components/dashboard/Settings";
import LoadingScreen from "@/components/LoadingScreen";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const steps = [
  { id: 1, title: "Sube tu CV", description: "Carga tu archivo actual (PDF o DOCX)" },
  { id: 2, title: "Oferta de trabajo", description: "Pega la descripción del puesto que te interesa" },
  { id: 3, title: "¡Casi listo!", description: "Crea tu cuenta para ver tu CV optimizado" },
  { id: 4, title: "Finalizando", description: "Generando tu documento adaptado" },
];

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [fileId, setFileId] = useState<string | null>(() => localStorage.getItem("onboarding_file_id"));
  const [jobDescription, setJobDescription] = useState("");
  const [isReviewingSettings, setIsReviewingSettings] = useState(false);
  
  const { isAuthenticated } = useAuth();
  const { 
    status: apiStatus, 
    error: apiError, 
    extractedProfile,
    uploadFile, 
    extractProfile,
    reset: resetApiState
  } = useOnboardingProcess();
  const navigate = useNavigate();
  const processStarted = useRef(false);

  // Redirigir si ya está autenticado (Onboarding es solo para nuevos)
  // Pero permitir quedarse si hay un proceso activo o estamos en el paso final
  useEffect(() => {
    if (isAuthenticated && currentStep === 1 && !fileId && !jobDescription) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate, currentStep, fileId, jobDescription]);

  const handleFileUpload = async (selectedFile: File) => {
    if (fileId) return;
    setFile(selectedFile);
    try {
      const id = await uploadFile(selectedFile);
      setFileId(id);
      localStorage.setItem("onboarding_file_id", id);
      localStorage.setItem("onboarding_file_name", selectedFile.name);
      
      // Si ya tenemos descripción y estamos autenticados (venimos de un error en el paso 4)
      // saltamos directamente de vuelta al paso 4 para procesar el nuevo archivo
      if (jobDescription && isAuthenticated) {
        setCurrentStep(4);
      }
    } catch (err) {
      console.error("Error al subir el archivo inicialmente:", err);
    }
  };

  const handleResetFile = () => {
    setFile(null);
    setFileId(null);
    localStorage.removeItem("onboarding_file_id");
    localStorage.removeItem("onboarding_file_name");
    resetApiState();
    processStarted.current = false;
    setCurrentStep(1);
  };

  useEffect(() => {
    const savedName = localStorage.getItem("onboarding_file_name");
    if (fileId && savedName && !file) {
      setFile({ name: savedName } as File);
    }
  }, [fileId, file]);

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => setCurrentStep((prev) => prev - 1);

  const handleRegisterSuccess = () => {
    setCurrentStep(4);
  };

  const handleProcessCompletion = (result: any) => {
    console.log("Onboarding completado con éxito:", result);
    localStorage.removeItem("onboarding_file_id");
    localStorage.removeItem("onboarding_file_name");
    // La redirección no es inmediata para permitir al usuario ver el resultado 
    // o el ResumeEnhancerFlow se encarga de mostrar el preview final.
  };

  const executeExtraction = async () => {
    if (!fileId) return;
    processStarted.current = true;
    try {
      await extractProfile(fileId);
      setIsReviewingSettings(true);
    } catch (err) {
      console.error("Error en la extracción:", err);
    }
  };

  useEffect(() => {
    if (currentStep === 4 && fileId && !processStarted.current) {
      executeExtraction();
    }
  }, [currentStep, fileId]);

  const isFinalStep = currentStep === 4;

  return (
    <div className="min-h-screen bg-background font-body">
      <Navbar hideAuth={true} />
      <div className={`${isFinalStep ? "max-w-6xl" : "max-w-2xl"} mx-auto px-4 py-12 transition-all duration-500`}>
        {/* Progress bar */}
        <div className="flex justify-between mb-12 relative max-w-2xl mx-auto">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-muted -translate-y-1/2 z-0 rounded-full"></div>
          <div 
            className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 z-0 rounded-full transition-all duration-500"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          ></div>
          {steps.map((step) => (
            <div
              key={step.id}
              className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 border-4 ${
                currentStep >= step.id 
                  ? "bg-primary text-primary-foreground border-primary shadow-lg scale-110" 
                  : "bg-muted text-muted-foreground border-muted"
              }`}
            >
              {currentStep > step.id ? <CheckCircle2 className="w-6 h-6" /> : step.id}
            </div>
          ))}
        </div>

        <Card className={`border-border shadow-xl rounded-3xl overflow-hidden border-none bg-card/50 backdrop-blur-sm ${isFinalStep ? "p-4" : ""}`}>
          {!isFinalStep && (
            <CardHeader className="pb-2 text-center pt-8">
              <CardTitle className="text-3xl font-black tracking-tight">{steps[currentStep - 1].title}</CardTitle>
              <CardDescription className="text-base">{steps[currentStep - 1].description}</CardDescription>
            </CardHeader>
          )}
          <CardContent className={`${isFinalStep ? "p-0" : "p-8"}`}>
            {currentStep === 1 && (
              <StepUpload 
                file={file} 
                fileId={fileId} 
                apiStatus={apiStatus} 
                apiError={apiError}
                onFileUpload={handleFileUpload} 
              />
            )}

            {currentStep === 2 && (
              <StepJobDescription 
                value={jobDescription} 
                onChange={setJobDescription} 
              />
            )}

            {currentStep === 3 && <StepAuth onSuccess={handleRegisterSuccess} />}

            {currentStep === 4 && (
              <div className="min-h-[60vh] flex flex-col items-center justify-center">
                {apiStatus === "processing" ? (
                  <LoadingScreen fullScreen={false} message="Analizando tu perfil..." />
                ) : apiStatus === "error" ? (
                  <div className="text-center space-y-6 animate-in fade-in zoom-in-95">
                    <div className="bg-destructive/10 w-20 h-20 rounded-full flex items-center justify-center text-destructive mx-auto">
                      <AlertCircle className="w-10 h-10" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-black">No pudimos procesar este archivo</h3>
                      <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                        Asegúrate de que el PDF sea legible y contenga información sobre tu experiencia.
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                      <Button onClick={executeExtraction} variant="outline" className="rounded-xl font-bold px-6">
                        Reintentar
                      </Button>
                      <Button onClick={handleResetFile} variant="default" className="rounded-xl font-black px-6 shadow-lg shadow-primary/20">
                        Subir otro archivo
                      </Button>
                    </div>
                  </div>
                ) : isReviewingSettings && extractedProfile ? (
                  <Settings 
                    showContinue={true} 
                    onContinue={() => setIsReviewingSettings(false)} 
                  />
                ) : extractedProfile ? (
                  <ResumeEnhancerFlow 
                    profile={extractedProfile}
                    initialJobDescription={jobDescription}
                    autoStart={true}
                    onComplete={handleProcessCompletion}
                  />
                ) : (
                  <LoadingScreen fullScreen={false} message="Preparando flujo de optimización..." />
                )}
              </div>
            )}

            {currentStep < 3 && (
              <div className="flex justify-between mt-12">
                <Button
                  variant="ghost"
                  onClick={prevStep}
                  disabled={currentStep === 1 || apiStatus === "uploading"}
                  className={`rounded-xl font-bold h-12 px-6 ${currentStep === 1 ? "invisible" : ""}`}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" /> Atrás
                </Button>
                <Button
                  onClick={nextStep}
                  disabled={(currentStep === 1 && (!file || !fileId || apiStatus === "uploading")) || (currentStep === 2 && !jobDescription)}
                  className="px-10 rounded-xl font-black h-12 text-lg shadow-xl shadow-primary/20 transition-all hover:shadow-primary/30"
                >
                  {currentStep === 2 ? "Generar mi CV" : "Continuar"} <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
