import { useState } from "react";
import { TailoredResumeViewModel, UserProfileViewModel } from "@/lib/viewmodels";

// Mock implementation of a tailored resume result
const getMockTailoredResume = (id: string, jobName: string, companyName: string): TailoredResumeViewModel => ({
  id,
  jobName,
  companyName,
  date: new Date().toLocaleDateString('es-ES'),
  optimizedSummary: `Cajero con experiencia en atención al cliente y gestión operativa, buscando iniciar mi carrera como ${jobName}. Poseo conocimientos sólidos en React, TypeScript y APIs. Mi enfoque se centra en la eficiencia y la resolución de problemas técnicos en entornos de alto rendimiento.`,
  optimizedExperience: [
    { 
      id: "1", 
      role: `${jobName} (Enfoque en Procesos Técnicos)`, 
      company: companyName, 
      period: "Junio 2023 – Actualidad",
      details: "Gestioné transacciones complejas utilizando sistemas POS, optimizando el tiempo de respuesta al cliente.\nColaboré en la resolución de incidencias técnicas básicas del sistema de ventas.\nUtilicé herramientas digitales internas para la gestión de inventario y comunicación corporativa."
    }
  ],
  optimizedSkills: ["React", "TypeScript", "Node.js", "Tailwind CSS", "APIs", "Git", "Agile"],
  optimizedEducation: [
    { id: "1", degree: "Bachillerato (Orientación Tecnológica)", institution: "Instituto Tecnológico", period: "2019 - 2021" }
  ],
  optimizedLanguages: [
    { id: "1", name: "Español", level: "Nativo" },
    { id: "2", name: "Inglés", level: "B2 - Técnico" }
  ],
  optimizedCertificates: ["Google Cloud Digital Leader", "Certificado de Desarrollo Web"],
  detectedKeywords: ["React", "TypeScript", "APIs", "Eficiencia", jobName],
  appliedChanges: [
    { section: "Resumen", description: `Se reenfocó el resumen para destacar el interés en ${jobName} y mencionar habilidades técnicas clave.` },
    { section: "Experiencia", description: "Se ajustaron los logros para resaltar el manejo de sistemas y procesos técnicos." },
    { section: "Habilidades", description: "Se priorizaron las tecnologías web y se añadieron metodologías ágiles relevantes para el puesto." }
  ],
  baseProfile: {} as UserProfileViewModel // This would be populated in a real app
});

export function useTailoredResume() {
  const [tailoredResume, setTailoredResume] = useState<TailoredResumeViewModel | null>(null);
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(false);

  const generateResume = async (jobDescription: string, profile: UserProfileViewModel) => {
    setGenerating(true);
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newResume = getMockTailoredResume(
      Math.random().toString(),
      "Frontend Developer", // In reality, this would be extracted from the jobDescription by AI
      "Empresa Destino"
    );
    newResume.baseProfile = profile;
    
    setTailoredResume(newResume);
    setGenerating(false);
    return newResume;
  };

  const fetchTailoredResume = async (id: string, profile: UserProfileViewModel) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const resume = getMockTailoredResume(id, "Puesto del Historial", "Empresa del Historial");
    resume.baseProfile = profile;
    
    setTailoredResume(resume);
    setLoading(false);
    return resume;
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
