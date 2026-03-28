import { useState, useEffect } from "react";
import { AdaptedResumeViewModel } from "@/lib/viewmodels";
import { AdaptedResumeDTO, UpdateAdaptedResumeRequestDTO } from "@/lib/dtos";
import { apiFetch } from "@/lib/apiClient";

export function useResumes() {
  const [resumes, setResumes] = useState<AdaptedResumeViewModel[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchResumes = async () => {
    setLoading(true);
    try {
      const data: AdaptedResumeDTO[] = await apiFetch("/resumes/");
      const mapped = data.map(r => ({
        id: r.id,
        companyName: r.company_name,
        resumeName: r.job_name,
        date: r.date
      }));
      setResumes(mapped);
    } catch (err) {
      console.error("Error fetching resumes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const deleteResume = async (id: string) => {
    const previous = [...resumes];
    setResumes(prev => prev.filter(r => r.id !== id));
    try {
      await apiFetch(`/resumes/${id}`, { method: "DELETE" });
    } catch (err) {
      console.error("Error deleting resume:", err);
      setResumes(previous);
    }
  };

  const updateResume = async (id: string, updates: Partial<AdaptedResumeViewModel>) => {
    const previous = [...resumes];
    setResumes(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
    
    try {
      const updateReq: UpdateAdaptedResumeRequestDTO = {};
      if (updates.companyName) updateReq.company_name = updates.companyName;
      if (updates.resumeName) updateReq.resume_name = updates.resumeName;

      await apiFetch(`/resumes/${id}`, {
        method: "PATCH",
        body: JSON.stringify(updateReq),
      });
    } catch (err) {
      console.error("Error updating resume:", err);
      setResumes(previous);
    }
  };

  return { resumes, loading, deleteResume, updateResume, refreshResumes: fetchResumes };
}
