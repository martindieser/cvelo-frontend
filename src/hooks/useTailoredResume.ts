import { useState } from "react";
import { TailoredResumeViewModel, UserProfileViewModel } from "@/lib/viewmodels";
import { 
  EnhanceResumeRequestDTO, 
  TaskResponseDTO, 
  TaskStatusDTO, 
  TailoredResumeDTO 
} from "@/lib/dtos";
import { apiFetch } from "@/lib/apiClient";

export function useTailoredResume() {
  const [tailoredResume, setTailoredResume] = useState<TailoredResumeViewModel | null>(null);
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(false);

  const pollTask = async (taskId: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const interval = setInterval(async () => {
        try {
          const task: TaskStatusDTO = await apiFetch(`/resumes/tasks/${taskId}`);
          if (task.status === "COMPLETED") {
            clearInterval(interval);
            // Result for enhance/process task is the resume_id
            resolve(task.result.resume_id || task.result.id); 
          } else if (task.status === "FAILED") {
            clearInterval(interval);
            reject(new Error(task.error || "Task failed"));
          }
        } catch (err) {
          clearInterval(interval);
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
    try {
      const enhanceReq: EnhanceResumeRequestDTO = { job_description: jobDescription };
      const task: TaskResponseDTO = await apiFetch("/resumes/enhance", {
        method: "POST",
        body: JSON.stringify(enhanceReq),
      });

      const resumeId = await pollTask(task.task_id);
      
      const result: TailoredResumeDTO = await apiFetch(`/resumes/${resumeId}/tailored`);
      const mapped = mapTailoredDTO(result, profile);
      
      setTailoredResume(mapped);
      return mapped;
    } catch (err) {
      console.error("Error generating resume:", err);
      throw err;
    } finally {
      setGenerating(false);
    }
  };

  const fetchTailoredResume = async (id: string, profile: UserProfileViewModel) => {
    setLoading(true);
    try {
      const result: TailoredResumeDTO = await apiFetch(`/resumes/${id}/tailored`);
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

  const clearTailoredResume = () => setTailoredResume(null);

  return { 
    tailoredResume, 
    generating, 
    loading, 
    generateResume, 
    fetchTailoredResume,
    clearTailoredResume
  };
}
