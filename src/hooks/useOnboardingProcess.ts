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
  const [status, setStatus] = useState<"idle" | "uploading" | "processing" | "enhancing" | "awaiting_approval" | "completed" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [extractedProfile, setExtractedProfile] = useState<UserProfileDTO | null>(null);
  const [enhanceTaskId, setEnhanceTaskId] = useState<string | null>(null);
  const [taskResult, setTaskResult] = useState<any>(null);

  const pollTask = useCallback(async (taskId: string, onAwaitingApproval?: (result: any) => void): Promise<any> => {
    return new Promise((resolve, reject) => {
      const interval = setInterval(async () => {
        try {
          const task: TaskStatusDTO = await apiCall(`/resumes/tasks/${taskId}`);
          
          if (task.status === "AWAITING_APPROVAL") {
            clearInterval(interval);
            if (onAwaitingApproval) onAwaitingApproval(task.result);
            resolve(task.result);
          } else if (task.status === "COMPLETED") {
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

  const startOnboardingProcess = useCallback(async (fileId: string, jobDescription: string) => {
    setStatus("processing");
    setError(null);

    try {
      // 1. Process (Extract profile)
      const processReq: ProcessResumeRequestDTO = { file_id: fileId };
      const processTask: TaskResponseDTO = await apiCall("/resumes/process", {
        method: "POST",
        body: JSON.stringify(processReq),
      });

      const profile = await pollTask(processTask.task_id);
      setExtractedProfile(profile);

      // 2. Enhance (Tailor to job description)
      setStatus("enhancing");
      const enhanceReq: EnhanceResumeRequestDTO = { job_description: jobDescription };
      const enhanceTask: TaskResponseDTO = await apiCall("/resumes/enhance", {
        method: "POST",
        body: JSON.stringify(enhanceReq),
      });

      setEnhanceTaskId(enhanceTask.task_id);

      const result = await pollTask(enhanceTask.task_id, (res) => {
        setTaskResult(res);
        setStatus("awaiting_approval");
      });
      
      // If result is returned directly (e.g. fast processing), handle status
      if (result && result.status !== "AWAITING_APPROVAL") {
        setStatus("completed");
      }
      return result;
    } catch (err: any) {
      setError(err.message || "Ocurrió un error durante el procesamiento.");
      setStatus("error");
      throw err;
    }
  }, [apiCall, pollTask]);

  const approveTask = useCallback(async (matches: MatchesDTO) => {
    if (!enhanceTaskId) return;
    
    setStatus("enhancing");
    setError(null);
    try {
      const approvalReq: ApprovalRequestDTO = { matches };
      await apiCall(`/resumes/enhance/${enhanceTaskId}/approval`, {
        method: "POST",
        body: JSON.stringify(approvalReq),
      });

      const result = await pollTask(enhanceTaskId);
      setStatus("completed");
      return result;
    } catch (err: any) {
      setError(err.message || "Error al aprobar los cambios.");
      setStatus("error");
      throw err;
    }
  }, [apiCall, enhanceTaskId, pollTask]);

  return {
    status,
    error,
    extractedProfile,
    taskResult,
    uploadFile,
    startOnboardingProcess,
    approveTask
  };
}
