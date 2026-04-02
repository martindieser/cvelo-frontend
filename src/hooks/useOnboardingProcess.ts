import { useState, useCallback } from "react";
import { useApi } from "./useApi";
import { 
  UploadResponseDTO, 
  ProcessResumeRequestDTO, 
  TaskResponseDTO, 
  TaskStatusDTO, 
  EnhanceResumeRequestDTO,
  MatchesDTO,
  ApprovalRequestDTO,
  UserProfileDTO
} from "@/lib/dtos";
import { UserProfileViewModel } from "@/lib/viewmodels";

export function useOnboardingProcess() {
  const { apiCall } = useApi();
  const [status, setStatus] = useState<"idle" | "uploading" | "processing" | "enhancing" | "awaiting_approval" | "completed" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [extractedProfile, setExtractedProfile] = useState<UserProfileViewModel | null>(null);
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

  const mapProfile = (data: UserProfileDTO): UserProfileViewModel => ({
    name: data.name ?? "",
    email: data.email,
    credits: data.credits,
    avatar: data.avatar ?? "",
    location: data.location ?? "",
    phone: data.phone ?? "",
    summary: data.summary ?? "",
    skills: data.skills,
    socialLinks: (data.social_links || []).map((s, i) => ({ id: i.toString(), platform: s.platform, url: s.url ?? "" })),
    experience: (data.experience || []).map((e, i) => ({ 
      id: i.toString(), 
      role: e.role, 
      company: e.company, 
      period: e.period, 
      details: Array.isArray(e.details) ? e.details.join("\n") : "" 
    })),
    education: (data.education || []).map((edu, i) => ({ 
      id: i.toString(), 
      degree: edu.degree, 
      institution: edu.institution, 
      period: edu.period 
    })),
    languages: (data.languages || []).map((l, i) => ({ 
      id: i.toString(), 
      name: l.name, 
      level: l.level 
    })),
    projects: (data.projects || []).map((p, i) => ({
      id: i.toString(),
      title: p.title,
      details: Array.isArray(p.details) ? p.details.join("\n") : "",
      technologies: p.technologies ?? [],
      link: p.link ?? "",
      period: p.period ?? ""
    })),
    certificates: data.certificates || [],
    settings: {
      language: data.settings?.language || "es",
      tone: data.settings?.tone || "professional",
      template: data.settings?.template || "harvard",
      sectionsOrder: (data.settings?.sections_order || []).map(s => ({ 
        id: s.id, 
        name: s.id.charAt(0).toUpperCase() + s.id.slice(1),
        visible: s.visible ?? true
      }))
    }
  });

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

  const extractProfile = useCallback(async (fileId: string) => {
    setStatus("processing");
    setError(null);
    try {
      const processReq: ProcessResumeRequestDTO = { file_id: fileId };
      const processTask: TaskResponseDTO = await apiCall("/resumes/process", {
        method: "POST",
        body: JSON.stringify(processReq),
      });

      const profileData = await pollTask(processTask.task_id);
      const mappedProfile = mapProfile(profileData);
      setExtractedProfile(mappedProfile);
      setStatus("idle");
      return mappedProfile;
    } catch (err: any) {
      setError(err.message || "Error al extraer el perfil.");
      setStatus("error");
      throw err;
    }
  }, [apiCall, pollTask]);

  const startOnboardingProcess = useCallback(async (fileId: string, jobDescription: string) => {
    setStatus("processing");
    setError(null);

    try {
      // 1. Process (Extract profile)
      const profileData = await extractProfile(fileId);

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
      
      if (result && result.status !== "AWAITING_APPROVAL") {
        setStatus("completed");
      }
      return result;
    } catch (err: any) {
      setError(err.message || "Ocurrió un error durante el procesamiento.");
      setStatus("error");
      throw err;
    }
  }, [apiCall, pollTask, extractProfile]);

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
    extractProfile,
    startOnboardingProcess,
    approveTask
  };
}
