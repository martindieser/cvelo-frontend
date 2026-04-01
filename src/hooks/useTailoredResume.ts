import { useState } from "react";
import { TailoredResumeViewModel, UserProfileViewModel } from "@/lib/viewmodels";
import { 
  EnhanceResumeRequestDTO, 
  TaskResponseDTO, 
  TaskStatusDTO, 
  TailoredResumeDTO,
  TaskStatus,
  MatchesDTO,
  ApprovalRequestDTO
} from "@/lib/dtos";
import { useApi } from "./useApi";

export function useTailoredResume() {
  const { apiCall } = useApi();
  const [tailoredResume, setTailoredResume] = useState<TailoredResumeViewModel | null>(null);
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  const [taskStatus, setTaskStatus] = useState<TaskStatus>("PENDING");
  const [taskResult, setTaskResult] = useState<any>(null);

  const pollTask = async (taskId: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      const interval = setInterval(async () => {
        try {
          const task: TaskStatusDTO = await apiCall(`/resumes/tasks/${taskId}`);
          setTaskStatus(task.status);
          
          if (task.status === "AWAITING_APPROVAL") {
            clearInterval(interval);
            setTaskResult(task.result);
            setGenerating(false); // Liberar estado para interacción
            resolve(task.result);
          } else if (task.status === "COMPLETED") {
            clearInterval(interval);
            setTaskResult(task.result);
            setGenerating(false);
            resolve(task.result as TailoredResumeDTO); 
          }
 else if (task.status === "FAILED") {
            clearInterval(interval);
            setError(task.error || "Ocurrió un error inesperado al procesar tu currículum.");
            reject(new Error(task.error || "Task failed"));
          }
        } catch (err) {
          clearInterval(interval);
          setError("No se pudo conectar con el servidor para verificar el estado de la tarea.");
          reject(err);
        }
      }, 2000);
    });
  };

  const mapTailoredDTO = (dto: TailoredResumeDTO, profile: UserProfileViewModel): TailoredResumeViewModel => {
    const sectionNameMap: Record<string, string> = {
      "optimized_summary": "Resumen",
      "optimized_experience": "Experiencia",
      "optimized_projects": "Proyectos",
      "optimized_skills": "Habilidades",
      "optimized_education": "Educación",
      "optimized_languages": "Idiomas",
      "optimized_certificates": "Certificaciones",
      "summary": "Resumen",
      "experience": "Experiencia",
      "projects": "Proyectos",
      "skills": "Habilidades",
      "education": "Educación",
      "languages": "Idiomas",
      "certificates": "Certificaciones",
    };

    return {
      id: dto.resume_id || "temp-id",
      jobName: dto.job_name,
      companyName: dto.company_name,
      date: dto.date,
      pdfUrl: dto.pdf_url,
      summary: dto.summary ?? "",
      experience: dto.optimized_experience.map((e, i) => ({
        id: i.toString(),
        role: e.role,
        company: e.company,
        period: e.period,
        details: e.details.join("\n")
      })),
      skills: dto.optimized_skills,
      education: dto.optimized_education.map((edu, i) => ({
        id: i.toString(),
        degree: edu.degree,
        institution: edu.institution,
        period: edu.period
      })),
      languages: dto.optimized_languages.map((l, i) => ({
        id: i.toString(),
        name: l.name,
        level: l.level
      })),
      projects: dto.optimized_projects.map((p, i) => ({
        id: i.toString(),
        title: p.title,
        details: p.details.join("\n"),
        technologies: p.technologies ?? [],
        link: p.link ?? "",
        period: p.period ?? ""
      })),
      certificates: dto.optimized_certificates,
      detectedKeywords: dto.detected_keywords,
      appliedChanges: dto.applied_changes.map(c => ({
        section: sectionNameMap[c.section] || c.section,
        description: c.description
      })),
      baseProfile: profile
    };
  };

  const generateResume = async (jobDescription: string) => {
    setGenerating(true);
    setError(null);
    setTaskStatus("PENDING");
    try {
      const enhanceReq: EnhanceResumeRequestDTO = { job_description: jobDescription };
      const task: TaskResponseDTO = await apiCall("/resumes/enhance", {
        method: "POST",
        body: JSON.stringify(enhanceReq),
      });

      setCurrentTaskId(task.task_id);
      const result = await pollTask(task.task_id);
      setGenerating(false);
      return result;
    } catch (err) {
      console.error("Error initiating resume enhancement:", err);
      setGenerating(false);
      throw err;
    }
  };

  const approveResume = async (matches: MatchesDTO, profile: UserProfileViewModel) => {
    if (!currentTaskId) return;
    
    setGenerating(true);
    setError(null);
    try {
      const approvalReq: ApprovalRequestDTO = { matches };
      await apiCall(`/resumes/enhance/${currentTaskId}/approval`, {
        method: "POST",
        body: JSON.stringify(approvalReq),
      });

      // After approval, continue polling until completed
      const resultDto = await pollTask(currentTaskId);
      
      if (resultDto.resume_id) {
        return await fetchTailoredResume(resultDto.resume_id, profile);
      } else {
        throw new Error("No se pudo obtener el ID del currículum generado.");
      }
    } catch (err) {
      console.error("Error approving resume:", err);
      setGenerating(false);
      throw err;
    }
  };

  const fetchTailoredResume = async (id: string, profile: UserProfileViewModel) => {
    setLoading(true);
    setError(null);
    try {
      const result: TailoredResumeDTO = await apiCall(`/resumes/${id}/tailored`);
      const mapped = mapTailoredDTO(result, profile);
      setTailoredResume(mapped);
      return mapped;
    } catch (err) {
      console.error("Error fetching tailored resume:", err);
      throw err;
    } finally {
      setLoading(false);
      setGenerating(false);
    }
  };

  const clearTailoredResume = () => {
    setTailoredResume(null);
    setError(null);
    setCurrentTaskId(null);
    setTaskStatus("PENDING");
    setTaskResult(null);
  };

  const clearError = () => setError(null);

  return { 
    tailoredResume, 
    generating, 
    loading, 
    error,
    currentTaskId,
    taskStatus,
    taskResult,
    generateResume, 
    approveResume,
    fetchTailoredResume,
    clearTailoredResume,
    clearError
  };
}
