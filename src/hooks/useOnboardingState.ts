import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const ONBOARDING_KEYS = {
  STEP: "onboarding_step",
  FILE_ID: "onboarding_file_id",
  FILE_NAME: "onboarding_file_name",
  JOB_DESC: "onboarding_job_description"
};

export function useOnboardingState(isAuthenticated: boolean) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Paso actual derivado de la URL
  const currentStep = useMemo(() => {
    const step = parseInt(searchParams.get("step") || "1", 10);
    return isNaN(step) ? 1 : step;
  }, [searchParams]);

  // Estados locales inicializados desde localStorage
  const [fileId, setFileId] = useState<string | null>(() => localStorage.getItem(ONBOARDING_KEYS.FILE_ID));
  const [fileName, setFileName] = useState<string | null>(() => localStorage.getItem(ONBOARDING_KEYS.FILE_NAME));
  const [jobDescription, setJobDescription] = useState(() => localStorage.getItem(ONBOARDING_KEYS.JOB_DESC) || "");

  // Sincronizar jobDescription con localStorage
  useEffect(() => {
    if (jobDescription) {
      localStorage.setItem(ONBOARDING_KEYS.JOB_DESC, jobDescription);
    } else {
      localStorage.removeItem(ONBOARDING_KEYS.JOB_DESC);
    }
  }, [jobDescription]);

  // Restaurar paso al cargar si no hay parámetro en URL
  useEffect(() => {
    const hasStepParam = searchParams.has("step");
    const savedStep = localStorage.getItem(ONBOARDING_KEYS.STEP);
    
    if (!hasStepParam && savedStep && savedStep !== "1") {
      setSearchParams({ step: savedStep });
    }
  }, [searchParams, setSearchParams]);

  // Guardar paso actual en localStorage
  useEffect(() => {
    localStorage.setItem(ONBOARDING_KEYS.STEP, currentStep.toString());
  }, [currentStep]);

  // Navigation Guards & Redirecciones
  useEffect(() => {
    // 1. Si está autenticado y no hay intención de onboarding, al dashboard
    if (isAuthenticated && currentStep === 1 && !fileId && !jobDescription) {
      navigate("/dashboard");
      return;
    }

    // 2. Validar datos por paso
    if (currentStep > 1 && !fileId) {
      setSearchParams({ step: "1" });
    } else if (currentStep > 2 && !jobDescription && currentStep !== 4) {
      setSearchParams({ step: "2" });
    }
  }, [currentStep, fileId, jobDescription, isAuthenticated, navigate, setSearchParams]);

  const setOnboardingFile = useCallback((id: string, name: string) => {
    setFileId(id);
    setFileName(name);
    localStorage.setItem(ONBOARDING_KEYS.FILE_ID, id);
    localStorage.setItem(ONBOARDING_KEYS.FILE_NAME, name);
    setSearchParams({ step: "2" });
  }, [setSearchParams]);

  const nextStep = useCallback(() => {
    setSearchParams({ step: (currentStep + 1).toString() });
  }, [currentStep, setSearchParams]);

  const prevStep = useCallback(() => {
    setSearchParams({ step: (currentStep - 1).toString() });
  }, [currentStep, setSearchParams]);

  const reset = useCallback(() => {
    setFileId(null);
    setFileName(null);
    setJobDescription("");
    Object.values(ONBOARDING_KEYS).forEach(key => localStorage.removeItem(key));
    setSearchParams({ step: "1" });
  }, [setSearchParams]);

  const complete = useCallback(() => {
    Object.values(ONBOARDING_KEYS).forEach(key => localStorage.removeItem(key));
  }, []);

  return {
    currentStep,
    fileId,
    fileName,
    jobDescription,
    setJobDescription,
    setOnboardingFile,
    nextStep,
    prevStep,
    reset,
    complete
  };
}
