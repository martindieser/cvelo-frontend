import { useState, useCallback } from "react";
import { useApi } from "./useApi";
import { 
  UploadResponseDTO, 
  ProcessResumeRequestDTO, 
  TaskResponseDTO, 
  TaskStatusDTO, 
  EnhanceResumeRequestDTO,
  TaskStatus,
  UserProfileDTO,
  MatchesDTO,
  ApprovalRequestDTO
} from "@/lib/dtos";

export function useOnboardingProcess() {
  const { apiCall } = useApi();
  const [status, setStatus] = useState<"idle" | "uploading" | "processing" | "completed" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [extractedProfile, setExtractedProfile] = useState<UserProfileDTO | null>(null);

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
    setStatus("uploading");
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const uploadRes: UploadResponseDTO = await apiCall("/resumes/upload", {
        method: "POST",
        body: formData,
      });
      setStatus("idle");
      return uploadRes.file_id;
    } catch (err: any) {
      setError(err.message || "Error al subir el archivo.");
      setStatus("error");
      throw err;
    }
  }, [apiCall]);

  const startExtraction = useCallback(async (fileId: string) => {
    setStatus("processing");
    setError(null);

    try {
      const processReq: ProcessResumeRequestDTO = { file_id: fileId };
      const processTask: TaskResponseDTO = await apiCall("/resumes/process", {
        method: "POST",
        body: JSON.stringify(processReq),
      });

      const profile = await pollTask(processTask.task_id);
      setExtractedProfile(profile);
      setStatus("completed");
      return profile;
    } catch (err: any) {
      setError(err.message || "Error al extraer datos de tu perfil.");
      setStatus("error");
      throw err;
    }
  }, [apiCall, pollTask]);

  return {
    status,
    error,
    extractedProfile,
    uploadFile,
    startExtraction
  };
}
