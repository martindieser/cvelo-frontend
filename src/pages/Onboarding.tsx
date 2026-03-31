import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, Upload, Lock, CheckCircle2, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import RegisterForm from "@/components/auth/RegisterForm";
import LoadingScreen from "@/components/LoadingScreen";
import { useAuth } from "@/hooks/useAuth";
import { useOnboardingProcess } from "@/hooks/useOnboardingProcess";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  const { status: apiStatus, error: apiError, uploadFile, startOnboardingProcess } = useOnboardingProcess();
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

  useEffect(() => {
    if (currentStep === 5 && fileId && jobDescription && !processStarted.current) {
      processStarted.current = true;
      const runProcess = async () => {
        try {
          await startOnboardingProcess(fileId, jobDescription);
          localStorage.removeItem("onboarding_file_id");
          localStorage.removeItem("onboarding_file_name");
          setTimeout(() => navigate("/dashboard"), 1500);
        } catch (err) {
          console.error("Error en el proceso real:", err);
          processStarted.current = false; // Permitir re-intentar si falla
        }
      };
      runProcess();
    }
  }, [currentStep, fileId, jobDescription, startOnboardingProcess, navigate]);

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
              <div className="space-y-4">
                <div className={`border-2 border-dashed border-border rounded-3xl p-12 text-center transition-all bg-muted/20 relative group ${fileId ? "cursor-default border-primary/30" : "hover:border-primary/50 cursor-pointer"}`}>
                  {apiStatus === "uploading" && (
                    <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-3xl z-20 backdrop-blur-sm">
                      <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-10 h-10 text-primary animate-spin" />
                        <LoadingScreen fullScreen={false} message="Subiendo archivo" showLogo={false} />
                      </div>
                    </div>
                  )}
                  {!fileId && (
                    <Input
                      type="file"
                      className="hidden"
                      id="cv-upload"
                      accept=".pdf,.docx"
                      onChange={(e) => {
                        const selectedFile = e.target.files?.[0];
                        if (selectedFile) handleFileUpload(selectedFile);
                      }}
                    />
                  )}
                  <Label htmlFor={fileId ? "" : "cv-upload"} className={`space-y-4 block ${fileId ? "cursor-default" : "cursor-pointer"}`}>
                    <div className={`bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto text-primary transition-transform ${!fileId && "group-hover:scale-110"}`}>
                      {fileId ? <CheckCircle2 className="w-8 h-8" /> : <Upload className="w-8 h-8" />}
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold text-lg">{file ? file.name : "Elige tu CV actual"}</p>
                      <p className="text-sm text-muted-foreground">
                        {fileId ? "Archivo cargado correctamente" : "PDF o DOCX (máx. 10MB)"}
                      </p>
                    </div>
                    {fileId && (
                      <div className="pt-2">
                        <p className="text-xs text-green-600 font-black uppercase tracking-wider bg-green-50 py-1 px-3 rounded-full inline-block border border-green-100">
                          ✓ Archivo bloqueado y listo
                        </p>
                      </div>
                    )}
                  </Label>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                <Label htmlFor="job-desc" className="text-lg font-bold">Pega aquí la descripción del empleo:</Label>
                <Textarea
                  id="job-desc"
                  placeholder="Ej: Buscamos un Desarrollador con experiencia en React..."
                  className="min-h-[250px] rounded-2xl border-muted bg-muted/20 focus:bg-background transition-all resize-none p-4"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </div>
            )}

            {currentStep === 3 && (
              <div className="py-12">
                <LoadingScreen fullScreen={false} message="La IA está analizando tu perfil" />
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6 animate-in zoom-in-95">
                <div className="space-y-8">
                  <div className="bg-primary/5 border border-primary/10 p-6 rounded-3xl flex items-center gap-4">
                    <div className="bg-primary text-primary-foreground p-3 rounded-2xl shadow-lg">
                      <Lock className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-lg font-black leading-tight">Análisis completado</p>
                      <p className="text-sm text-muted-foreground">Crea tu cuenta para generar tu documento.</p>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <RegisterForm 
                      onToggle={() => {}} 
                      onSuccess={handleRegisterSuccess} 
                      hideToggle={true}
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="py-12 text-center space-y-8">
                {apiStatus === "error" ? (
                  <div className="space-y-6">
                    <div className="bg-destructive/10 w-24 h-24 rounded-full flex items-center justify-center text-destructive mx-auto">
                      <FileText className="w-12 h-12" />
                    </div>
                    <h3 className="text-2xl font-black">Algo no salió bien</h3>
                    <Alert variant="destructive" className="max-w-md mx-auto rounded-2xl border-none bg-destructive/5">
                      <AlertDescription className="font-medium">{apiError}</AlertDescription>
                    </Alert>
                    <Button onClick={() => setCurrentStep(1)} variant="outline" className="mt-4 rounded-xl font-bold px-8">
                      Volver a intentar
                    </Button>
                  </div>
                ) : (
                  <LoadingScreen 
                    fullScreen={false} 
                    message={
                      apiStatus === "processing" ? "Extrayendo habilidades" : 
                      apiStatus === "enhancing" ? "Generando CV final" : 
                      apiStatus === "completed" ? "¡Éxito! Redirigiendo" :
                      "Preparando documentos"
                    } 
                  />
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
