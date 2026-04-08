import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";

const ONBOARDING_KEYS = {
  STEP: "onboarding_step",
  FILE_ID: "onboarding_file_id",
  FILE_NAME: "onboarding_file_name",
  JOB_DESC: "onboarding_job_description",
  PENDING_EMAIL: "onboarding_pending_email"
};

export function useOnboardingState(isAuthenticated: boolean) {
  const [searchParams, setSearchParams] = useSearchParams();

  // 1. Cargar datos desde localStorage
  const [fileId, setFileId] = useState<string | null>(() => localStorage.getItem(ONBOARDING_KEYS.FILE_ID));
  const [fileName, setFileName] = useState<string | null>(() => localStorage.getItem(ONBOARDING_KEYS.FILE_NAME));
  const [jobDescription, setJobDescription] = useState(() => localStorage.getItem(ONBOARDING_KEYS.JOB_DESC) || "");
  const [pendingEmail, setPendingEmail] = useState<string | null>(() => localStorage.getItem(ONBOARDING_KEYS.PENDING_EMAIL));

  // 2. Determinar el paso sugerido según los atributos presentes (Fast-Forward)
  const suggestedStep = useMemo(() => {
    if (!fileId) return 1;
    if (!jobDescription) return 2;
    
    // Si no está autenticado Y no hay token físico en el storage, paso 3.
    // Si hay token, asumimos que puede intentar el paso 4 (el Traffic Controller o la API fallarán si el token es inválido).
    const hasToken = !!localStorage.getItem("token");
    if (!isAuthenticated && !hasToken) return 3;
    
    return 4;
  }, [fileId, jobDescription, isAuthenticated]);

  // 3. Paso actual: Respetar la URL si es válida, sino ir al sugerido
  const currentStep = useMemo(() => {
    const fromUrl = parseInt(searchParams.get("step") || "0", 10);
    
    // Si la URL pide un paso mayor al sugerido (saltarse pasos sin datos), la bloqueamos
    if (fromUrl > suggestedStep) return suggestedStep;
    
    // Si la URL es válida (paso 1, 2, 3 o el sugerido), la respetamos
    if (fromUrl > 0) return fromUrl;
    
    // Si no hay nada en URL, vamos al sugerido por los atributos
    return suggestedStep;
  }, [searchParams, suggestedStep]);

  // Sincronizar URL con el estado validado
  useEffect(() => {
    if (currentStep.toString() !== searchParams.get("step")) {
      setSearchParams({ step: currentStep.toString() }, { replace: true });
    }
  }, [currentStep, searchParams, setSearchParams]);

  // Sincronizar jobDescription con localStorage
  useEffect(() => {
    if (jobDescription) {
      localStorage.setItem(ONBOARDING_KEYS.JOB_DESC, jobDescription);
    } else {
      localStorage.removeItem(ONBOARDING_KEYS.JOB_DESC);
    }
  }, [jobDescription]);

  // Hecho: ¿Tenemos lo mínimo para reanudar el procesamiento?
  const hasResumeData = useMemo(() => !!(fileId && jobDescription), [fileId, jobDescription]);

  const setOnboardingFile = useCallback((id: string, name: string) => {
    setFileId(id);
    setFileName(name);
    localStorage.setItem(ONBOARDING_KEYS.FILE_ID, id);
    localStorage.setItem(ONBOARDING_KEYS.FILE_NAME, name);
  }, []);

  const setOnboardingPendingEmail = useCallback((email: string | null) => {
    setPendingEmail(email);
    if (email) {
      localStorage.setItem(ONBOARDING_KEYS.PENDING_EMAIL, email);
    } else {
      localStorage.removeItem(ONBOARDING_KEYS.PENDING_EMAIL);
    }
  }, []);

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
    setPendingEmail(null);
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
    pendingEmail,
    hasResumeData,
    setJobDescription,
    setOnboardingFile,
    setOnboardingPendingEmail,
    nextStep,
    prevStep,
    reset,
    complete
  };
}
