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
import StepAnalysisSimulated from "@/components/on-boarding/StepAnalysisSimulated";
import StepAuth from "@/components/on-boarding/StepAuth";
import StepFinalProcess from "@/components/on-boarding/StepFinalProcess";

const steps = [
  { id: 1, title: "Sube tu CV", description: "Carga tu archivo actual (PDF o DOCX)" },
  { id: 2, title: "Oferta de trabajo", description: "Pega la descripción del puesto que te interesa" },
  { id: 3, title: "Analizando", description: "Nuestra IA está trabajando para ti" },
  { id: 4, title: "¡Casi listo!", description: "Crea tu cuenta para ver tu CV optimizado" },
  { id: 5, title: "Finalizando", description: "Generando tu documento adaptado" },
];

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [fileId, setFileId] = useState<string | null>(() => localStorage.getItem("onboarding_file_id"));
  const [jobDescription, setJobDescription] = useState("");
  
  const { isAuthenticated } = useAuth();
  const { 
    status: apiStatus, 
    error: apiError, 
    extractedProfile,
    uploadFile, 
    startExtraction
  } = useOnboardingProcess();
  const navigate = useNavigate();
  const processStarted = useRef(false);

  // Redirigir si ya está autenticado (Onboarding es solo para nuevos)
  useEffect(() => {
    if (isAuthenticated && currentStep < 5) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate, currentStep]);

  const handleFileUpload = async (selectedFile: File) => {
    if (fileId) return;
    setFile(selectedFile);
    try {
      const id = await uploadFile(selectedFile);
      setFileId(id);
      localStorage.setItem("onboarding_file_id", id);
      localStorage.setItem("onboarding_file_name", selectedFile.name);
    } catch (err) {
      console.error("Error al subir el archivo inicialmente:", err);
    }
  };

  useEffect(() => {
    const savedName = localStorage.getItem("onboarding_file_name");
    if (fileId && savedName && !file) {
      setFile({ name: savedName } as File);
    }
  }, [fileId, file]);

  const nextStep = () => {
    if (currentStep === 2) {
      handleSimulatedProcess();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => setCurrentStep((prev) => prev - 1);

  const handleSimulatedProcess = () => {
    setCurrentStep(3);
    setTimeout(() => {
      setCurrentStep(4);
    }, 3500);
  };

  const handleRegisterSuccess = () => {
    setCurrentStep(5);
  };

  const handleBack = () => {
    setCurrentStep(1); // Volver al paso de Job Description
    processStarted.current = false;
  };

  const handleProcessCompletion = (resumeId: string) => {
    console.log("Onboarding completado con éxito, resumeId:", resumeId);
    
    localStorage.removeItem("onboarding_file_id");
    localStorage.removeItem("onboarding_file_name");
    
    setTimeout(() => {
      navigate(`/dashboard?resumeId=${resumeId}`);
    }, 1500);
  };

  const executeFinalProcess = async () => {
    if (!fileId) return;
    
    processStarted.current = true;
    try {
      await startExtraction(fileId);
    } catch (err) {
      console.error("Error en la extracción de datos:", err);
    }
  };

  useEffect(() => {
    if (currentStep === 5 && fileId && !processStarted.current) {
      executeFinalProcess();
    }
  }, [currentStep, fileId]);

  return (
    <div className="min-h-screen bg-background font-body">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Progress bar */}
        <div className="flex justify-between mb-12 relative">
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

        <Card className="border-border shadow-xl rounded-3xl overflow-hidden border-none bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-2 text-center pt-8">
            <CardTitle className="text-3xl font-black tracking-tight">{steps[currentStep - 1].title}</CardTitle>
            <CardDescription className="text-base">{steps[currentStep - 1].description}</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
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

            {currentStep === 3 && <StepAnalysisSimulated />}

            {currentStep === 4 && <StepAuth onSuccess={handleRegisterSuccess} />}

            {currentStep === 5 && (
              <StepFinalProcess 
                apiStatus={apiStatus} 
                apiError={apiError} 
                onRetry={executeFinalProcess}
                onComplete={handleProcessCompletion}
                extractedProfile={extractedProfile}
                jobDescription={jobDescription}
              />
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
