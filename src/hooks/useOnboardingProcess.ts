import { useState, useCallback } from "react";
import { useApi } from "./useApi";
import { 
  UploadResponseDTO, 
  ProcessResumeRequestDTO, 
  TaskResponseDTO, 
  TaskStatusDTO, 
  EnhanceResumeRequestDTO 
} from "@/lib/dtos";

export function useOnboardingProcess() {
  const { apiCall } = useApi();
  const [status, setStatus] = useState<"idle" | "uploading" | "processing" | "enhancing" | "completed" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const pollTask = useCallback(async (taskId: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      const interval = setInterval(async () => {
        try {
          const task: TaskStatusDTO = await apiCall(`/resumes/tasks/${taskId}`);
          if (task.status === "COMPLETED") {
            clearInterval(interval);
            resolve(task.result);
          } else if (task.status === "FAILED") {
            clearInterval(interval);
            reject(new Error(task.error || "La tarea falló"));
          }
        } catch (err) {
          clearInterval(interval);
          reject(err);
        }
      }, 2000);
    });
  }, [apiCall]);

  const uploadFile = useCallback(async (file: File): Promise<string> => {
    console.log("Subiendo archivo inmediatamente...", file.name);
    setStatus("uploading");
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const uploadRes: UploadResponseDTO = await apiCall("/resumes/upload", {
        method: "POST",
        body: formData,
      });
      console.log("Upload exitoso, file_id:", uploadRes.file_id);
      setStatus("idle");
      return uploadRes.file_id;
    } catch (err: any) {
      console.error("Error al subir archivo:", err);
      setError(err.message || "Error al subir el archivo.");
      setStatus("error");
      throw err;
    }
  }, [apiCall]);

  const startOnboardingProcess = useCallback(async (fileId: string, jobDescription: string) => {
    console.log("Iniciando procesamiento de IA con file_id:", fileId);
    setStatus("processing");
    setError(null);

    try {
      // 1. Process (Extract profile)
      const processReq: ProcessResumeRequestDTO = { file_id: fileId };
      const processTask: TaskResponseDTO = await apiCall("/resumes/process", {
        method: "POST",
        body: JSON.stringify(processReq),
      });

      await pollTask(processTask.task_id);

      // 2. Enhance (Tailor to job description)
      setStatus("enhancing");
      const enhanceReq: EnhanceResumeRequestDTO = { job_description: jobDescription };
      const enhanceTask: TaskResponseDTO = await apiCall("/resumes/enhance", {
        method: "POST",
        body: JSON.stringify(enhanceReq),
      });

      const result = await pollTask(enhanceTask.task_id);
      console.log("Adaptación completada exitosamente:", result);
      
      setStatus("completed");
      return result;
    } catch (err: any) {
      console.error("Onboarding process error:", err);
      setError(err.message || "Ocurrió un error durante el procesamiento.");
      setStatus("error");
      throw err;
    }
  }, [apiCall, pollTask]);

  return {
    status,
    error,
    uploadFile,
    startOnboardingProcess
  };
}
