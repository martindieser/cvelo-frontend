import { useState } from "react";
import { TailoredResumeViewModel, UserProfileViewModel } from "@/lib/viewmodels";
import { 
  EnhanceResumeRequestDTO, 
  TaskResponseDTO, 
  TaskStatusDTO, 
  TailoredResumeDTO 
} from "@/lib/dtos";
import { useApi } from "./useApi";

export function useTailoredResume() {
  const { apiCall } = useApi();
  const [tailoredResume, setTailoredResume] = useState<TailoredResumeViewModel | null>(null);
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);

  const pollTask = async (taskId: string): Promise<TailoredResumeDTO> => {
    return new Promise((resolve, reject) => {
      const interval = setInterval(async () => {
        try {
          const task: TaskStatusDTO = await apiCall(`/resumes/tasks/${taskId}`);
          if (task.status === "COMPLETED") {
            clearInterval(interval);
            // The result now contains the full tailored resume object including pdf_url
            resolve(task.result as TailoredResumeDTO); 
          } else if (task.status === "FAILED") {
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

  const mapTailoredDTO = (dto: TailoredResumeDTO, profile: UserProfileViewModel): TailoredResumeViewModel => ({
    id: dto.resume_id || "temp-id",
    jobName: dto.job_name,
    companyName: dto.company_name,
    date: dto.date,
    pdfUrl: dto.pdf_url,
    optimizedSummary: dto.summary ?? "",
    optimizedExperience: dto.optimized_experience.map((e, i) => ({
      id: i.toString(),
      role: e.role,
      company: e.company,
      period: e.period,
      details: e.details.join("\n")
    })),
    optimizedSkills: dto.optimized_skills,
    optimizedEducation: dto.optimized_education.map((edu, i) => ({
      id: i.toString(),
      degree: edu.degree,
      institution: edu.institution,
      period: edu.period
    })),
    optimizedLanguages: dto.optimized_languages.map((l, i) => ({
      id: i.toString(),
      name: l.name,
      level: l.level
    })),
    optimizedProjects: dto.optimized_projects.map((p, i) => ({
      id: i.toString(),
      title: p.title,
      details: p.details.join("\n"),
      technologies: p.technologies ?? [],
      link: p.link ?? "",
      period: p.period ?? ""
    })),
    optimizedCertificates: dto.optimized_certificates,
    detectedKeywords: dto.detected_keywords,
    appliedChanges: dto.applied_changes.map(c => ({
      section: c.section,
      description: c.description.join("\n")
    })),
    baseProfile: profile
  });

  const generateResume = async (jobDescription: string, profile: UserProfileViewModel) => {
    setGenerating(true);
    setError(null);
    try {
      const enhanceReq: EnhanceResumeRequestDTO = { job_description: jobDescription };
      const task: TaskResponseDTO = await apiCall("/resumes/enhance", {
        method: "POST",
        body: JSON.stringify(enhanceReq),
      });

      setCurrentTaskId(task.task_id);

      // Polling now returns the full tailored object
      const resultDto = await pollTask(task.task_id);
      
      // En lugar de mapear aquí, llamamos a fetchTailoredResume para unificar el flujo
      // como si viniéramos de "Mis Documentos"
      if (resultDto.resume_id) {
        return await fetchTailoredResume(resultDto.resume_id, profile);
      } else {
        throw new Error("No se pudo obtener el ID del currículum generado.");
      }
    } catch (err) {
      console.error("Error generating resume:", err);
      throw err;
    } finally {
      setGenerating(false);
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
    }
  };

  const clearTailoredResume = () => {
    setTailoredResume(null);
    setError(null);
    setCurrentTaskId(null);
  };

  const clearError = () => setError(null);

  return { 
    tailoredResume, 
    generating, 
    loading, 
    error,
    currentTaskId,
    generateResume, 
    fetchTailoredResume,
    clearTailoredResume,
    clearError
  };
}
