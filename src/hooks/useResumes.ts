import { useState, useEffect } from "react";
import { AdaptedResumeViewModel } from "@/lib/viewmodels";

const mockResumes: AdaptedResumeViewModel[] = [
  { id: "1", companyName: "Mercado Libre", resumeName: "CV Frontend Dev - ML", date: "24/03/2026" },
  { id: "2", companyName: "Globant", resumeName: "React Engineer Globant", date: "22/03/2026" },
  { id: "3", companyName: "Google", resumeName: "Senior Frontend Search", date: "20/03/2026" },
  { id: "4", companyName: "Accenture", resumeName: "Consultor Técnico", date: "18/03/2026" },
  { id: "5", companyName: "Amazon", resumeName: "Cloud Engineer AWS", date: "15/03/2026" },
  { id: "6", companyName: "Netflix", resumeName: "UI Specialist", date: "10/03/2026" },
];

export function useResumes() {
  const [resumes, setResumes] = useState<AdaptedResumeViewModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResumes = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 600));
      setResumes(mockResumes);
      setLoading(false);
    };

    fetchResumes();
  }, []);

  const deleteResume = async (id: string) => {
    setResumes(prev => prev.filter(r => r.id !== id));
    console.log("Resume deleted:", id);
  };

  const updateResume = async (id: string, updates: Partial<AdaptedResumeViewModel>) => {
    setResumes(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
    console.log("Resume updated:", id, updates);
  };

  return { resumes, loading, deleteResume, updateResume };
}
