import { useState, useEffect } from "react";
import { AppConfigViewModel, SectionViewModel, TemplateViewModel } from "@/lib/viewmodels";
import { useApi } from "./useApi";
import { AppConfigDTO } from "@/lib/dtos";

const API_URL = import.meta.env.VITE_API_URL || "";

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
  defaultSections: DEFAULT_SECTIONS,
  pricePerCredit: 3000 // Default fallback
};

export const useConfig = () => {
  const [config, setConfig] = useState<AppConfigViewModel>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { apiCall } = useApi();

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setLoading(true);
        const data = await apiCall("/config");
        
        if (data) {
          const dto = data as AppConfigDTO;
          const mappedConfig: AppConfigViewModel = {
            templates: dto.templates.map(t => {
              // Si la URL es relativa (empieza con /), le pegamos el API_URL
              const fullThumbnailUrl = (t.thumbnail_url && t.thumbnail_url.startsWith("/"))
                ? `${API_URL}${t.thumbnail_url}`
                : t.thumbnail_url;

              return {
                id: t.id,
                name: t.name,
                description: t.description,
                thumbnailUrl: fullThumbnailUrl || "/placeholder.svg",
                supportedSections: t.supported_sections
              };
            }),
            defaultSections: dto.default_sections.map(s => ({
              id: s.id,
              name: s.name,
              visible: s.visible
            })),
            pricePerCredit: dto.credit_price
          };
          setConfig(mappedConfig);
        }
      } catch (err) {
        console.error("Error fetching app config, using defaults:", err);
        setError("No se pudo cargar la configuración del servidor.");
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, [apiCall]);

  return { config, loading, error };
};
