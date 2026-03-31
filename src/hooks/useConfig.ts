import { useState, useEffect } from "react";
import { AppConfigViewModel, SectionViewModel, TemplateViewModel } from "@/lib/viewmodels";
import { apiClient } from "@/lib/apiClient";
import { AppConfigDTO } from "@/lib/dtos";

const DEFAULT_SECTIONS: SectionViewModel[] = [
  { id: "summary", name: "Resumen", visible: true },
  { id: "experience", name: "Experiencia", visible: true },
  { id: "education", name: "Educación", visible: true },
  { id: "skills", name: "Habilidades", visible: true },
  { id: "languages", name: "Idiomas", visible: true },
  { id: "certificates", name: "Certificados", visible: true },
  { id: "projects", name: "Proyectos", visible: true },
];

const DEFAULT_TEMPLATES: TemplateViewModel[] = [
  { 
    id: "harvard", 
    name: "Harvard (Classic)", 
    description: "Limpio y profesional, estándar de la industria.",
    thumbnailUrl: "/placeholder.svg",
    supportedSections: ["summary", "experience", "education", "skills", "languages", "certificates", "projects"]
  },
];

const DEFAULT_CONFIG: AppConfigViewModel = {
  templates: DEFAULT_TEMPLATES,
  defaultSections: DEFAULT_SECTIONS
};

export const useConfig = () => {
  const [config, setConfig] = useState<AppConfigViewModel>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get<AppConfigDTO>("/config");
        
        if (response.data) {
          const mappedConfig: AppConfigViewModel = {
            templates: response.data.templates.map(t => ({
              id: t.id,
              name: t.name,
              description: t.description,
              thumbnailUrl: t.thumbnail_url,
              supportedSections: t.supported_sections
            })),
            defaultSections: response.data.default_sections.map(s => ({
              id: s.id,
              name: s.name,
              visible: s.visible
            }))
          };
          setConfig(mappedConfig);
        }
      } catch (err) {
        console.error("Error fetching app config, using defaults:", err);
        setError("No se pudo cargar la configuración del servidor.");
        // We keep DEFAULT_CONFIG as already set in useState
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  return { config, loading, error };
};
