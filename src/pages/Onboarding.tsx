import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, Upload, FileText, Share2, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Navbar from "@/components/Navbar";

const steps = [
  { id: 1, title: "Sube tu CV", description: "Carga tu archivo actual (PDF o DOCX)" },
  { id: 2, title: "Descripción del puesto", description: "Pega la oferta de trabajo a la que aplicas" },
  { id: 3, title: "¿Cómo nos conociste?", description: "Queremos saber de dónde vienes" },
  { id: 4, title: "Procesando", description: "Nuestra IA está trabajando..." },
  { id: 5, title: "Ver resultado", description: "Tu CV optimizado está listo" },
];

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [source, setSource] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const nextStep = () => {
    if (currentStep === 3) {
      handleProcess();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => setCurrentStep((prev) => prev - 1);

  const handleProcess = () => {
    setCurrentStep(4);
    setIsProcessing(true);
    // Simulamos un proceso de IA de 3 segundos
    setTimeout(() => {
      setIsProcessing(false);
      setCurrentStep(5);
    }, 3000);
  };

  const handleLoginRedirect = () => {
    // Aquí iría la lógica para redirigir al login
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Progress bar */}
        <div className="flex justify-between mb-8 relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-muted -translate-y-1/2 z-0"></div>
          {steps.map((step) => (
            <div
              key={step.id}
              className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                currentStep >= step.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {currentStep > step.id ? <CheckCircle2 className="w-5 h-5" /> : step.id}
            </div>
          ))}
        </div>

        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle>{steps[currentStep - 1].title}</CardTitle>
            <CardDescription>{steps[currentStep - 1].description}</CardDescription>
          </CardHeader>
          <CardContent>
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-primary/50 transition-colors cursor-pointer bg-muted/20">
                  <Input
                    type="file"
                    className="hidden"
                    id="cv-upload"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                  <Label htmlFor="cv-upload" className="cursor-pointer space-y-4 block">
                    <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto text-primary">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold">{file ? file.name : "Haz clic para subir o arrastra tu CV"}</p>
                      <p className="text-xs text-muted-foreground">PDF, DOCX hasta 10MB</p>
                    </div>
                  </Label>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <Label htmlFor="job-desc">Pega la descripción completa del puesto aquí:</Label>
                <Textarea
                  id="job-desc"
                  placeholder="Ej: Buscamos un Senior React Developer con 5 años de experiencia..."
                  className="min-h-[200px]"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <RadioGroup value={source} onValueChange={setSource} className="space-y-3">
                  {[
                    { id: "linkedin", label: "LinkedIn" },
                    { id: "tiktok", label: "TikTok" },
                    { id: "instagram", label: "Instagram" },
                    { id: "friend", label: "Un amigo me recomendó" },
                    { id: "other", label: "Otro" },
                  ].map((option) => (
                    <div
                      key={option.id}
                      className={`flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                        source === option.id ? "border-primary bg-primary/5" : "border-border"
                      }`}
                    >
                      <RadioGroupItem value={option.id} id={option.id} />
                      <Label htmlFor={option.id} className="flex-1 cursor-pointer font-medium text-sm">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {currentStep === 4 && (
              <div className="py-12 text-center space-y-6">
                <div className="relative w-24 h-24 mx-auto">
                  <Loader2 className="w-24 h-24 text-primary animate-spin" />
                  <FileText className="w-10 h-10 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Analizando tu experiencia...</h3>
                  <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                    Nuestra IA está comparando tus habilidades con los requisitos del puesto para encontrar el "match" perfecto.
                  </p>
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="py-8 text-center space-y-6">
                <div className="bg-accent/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-accent">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">¡Tu CV adaptado está listo!</h3>
                  <p className="text-muted-foreground">
                    Hemos optimizado las palabras clave y reestructurado tus logros para maximizar tus posibilidades de entrevista.
                  </p>
                </div>
                <div className="bg-muted p-4 rounded-lg border border-border text-left flex gap-4 items-center">
                  <FileText className="w-10 h-10 text-muted-foreground" />
                  <div>
                    <p className="font-bold text-sm">CV_Adaptado_CurriAI.pdf</p>
                    <p className="text-xs text-muted-foreground">Listo para descargar</p>
                  </div>
                </div>
                <div className="pt-4">
                  <Button onClick={handleLoginRedirect} className="w-full py-6 text-lg font-bold gap-2">
                    Inicia sesión para descargar <ArrowRight className="w-5 h-5" />
                  </Button>
                  <p className="mt-4 text-xs text-muted-foreground">
                    Al unirte a CurriAI también desbloqueas la generación de cartas de presentación.
                  </p>
                </div>
              </div>
            )}

            {currentStep < 4 && (
              <div className="flex justify-between mt-8">
                <Button
                  variant="ghost"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={currentStep === 1 ? "invisible" : ""}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" /> Atrás
                </Button>
                <Button
                  onClick={nextStep}
                  disabled={(currentStep === 1 && !file) || (currentStep === 2 && !jobDescription) || (currentStep === 3 && !source)}
                  className="px-8"
                >
                  {currentStep === 3 ? "Generar mi CV" : "Continuar"} <ArrowRight className="w-4 h-4 ml-2" />
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
