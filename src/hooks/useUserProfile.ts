import { useState, useEffect } from "react";
import { UserProfileViewModel } from "@/lib/viewmodels";

// Mock data (consistent with existing components)
const mockProfile: UserProfileViewModel = {
  name: "Juan Pérez",
  email: "juan.perez@gmail.com",
  location: "Madrid, España",
  phone: "+34 600 000 000",
  summary: "Cuento con más de 2 años de experiencia en atención al cliente, manejo de POS y uso básico de computadoras de escritorio, donde cumplí procesos definidos con puntualidad y responsabilidad. Busco iniciar mi trayectoria en ingeniería de software y estoy dispuesto a aprender sobre desarrollo en la nube, programación, APIs y herramientas de monitoreo para aportar en entornos dinámicos y desafiantes.",
  skills: ["React", "TypeScript", "Node.js", "SQL", "Git", "Customer Service", "POS Management"],
  socialLinks: [
    { id: "1", platform: "LinkedIn", url: "https://linkedin.com/in/juanperez" },
    { id: "2", platform: "Portfolio", url: "https://juanperez.dev" }
  ],
  experience: [
    { 
      id: "1", 
      role: "Cajero", 
      company: "Large Ducks Coffee", 
      period: "Junio 2023 – Actualidad",
      details: "Operé la caja registradora POS para cobrar a clientes y entregar cambio con precisión mientras preparaba alimentos y bebidas.\nManejé horarios de alta demanda mediante la multitarea y un servicio al cliente consistente.\nUtilicé una computadora de escritorio para gestionar correo electrónico interno y completar capacitaciones en línea."
    }
  ],
  education: [
    { id: "1", degree: "Bachillerato", institution: "Instituto Tecnológico", period: "2019 - 2021" }
  ],
  languages: [
    { id: "1", name: "Español", level: "Nativo" },
    { id: "2", name: "Inglés", level: "B2 - Intermedio Alto" }
  ],
  certificates: ["Certificado de Atención al Cliente", "Google Cloud Digital Leader"],
  settings: {
    language: "auto",
    tone: "professional",
    template: "modern",
    sectionsOrder: [
      { id: "resumen", name: "Resumen" },
      { id: "experiencia", name: "Experiencia" },
      { id: "educacion", name: "Educación" },
      { id: "skills", name: "Habilidades" },
      { id: "lenguajes", name: "Idiomas" },
      { id: "certificados", name: "Certificados" },
    ]
  },
  adaptedResumes: [
    { id: "1", companyName: "Mercado Libre", resumeName: "CV Frontend Dev - ML", date: "24/03/2026" },
  ]
};

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfileViewModel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating on-demand fetch
    const fetchProfile = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setProfile(mockProfile);
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const updateProfile = async (newProfile: Partial<UserProfileViewModel>) => {
    // Simulate API update
    setProfile(prev => prev ? { ...prev, ...newProfile } : null);
    console.log("Profile updated:", newProfile);
  };

  return { profile, updateProfile, loading };
}
