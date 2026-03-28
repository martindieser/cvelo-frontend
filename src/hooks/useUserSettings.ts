import { useState, useEffect } from "react";
import { UserSettingsViewModel } from "@/lib/viewmodels";
import { UserSettingsDTO, UpdateUserSettingsRequestDTO } from "@/lib/dtos";
import { apiFetch } from "@/lib/apiClient";

const SECTION_NAME_MAP: Record<string, string> = {
  summary: "Resumen",
  experience: "Experiencia",
  education: "Educación",
  skills: "Habilidades",
  languages: "Idiomas",
  certificates: "Certificados",
  projects: "Proyectos"
};

export function useUserSettings() {
  const [settings, setSettings] = useState<UserSettingsViewModel | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const data: UserSettingsDTO = await apiFetch("/users/me/settings");
      
      const mappedSettings: UserSettingsViewModel = {
        language: data.language,
        tone: data.tone,
        template: data.template,
        sectionsOrder: data.sections_order.map(s => ({ 
          id: s.id, 
          name: SECTION_NAME_MAP[s.id] || s.id.charAt(0).toUpperCase() + s.id.slice(1),
          visible: s.visible ?? true
        }))
      };

      setSettings(mappedSettings);
    } catch (err) {
      console.error("Error fetching settings:", err);
      // Fallback to defaults if API fails or user is new
      setSettings({
        language: "es",
        tone: "professional",
        template: "harvard",
        sectionsOrder: [
          { id: "summary", name: "Resumen", visible: true },
          { id: "experience", name: "Experiencia", visible: true },
          { id: "education", name: "Educación", visible: true },
          { id: "skills", name: "Habilidades", visible: true },
          { id: "languages", name: "Idiomas", visible: true },
          { id: "certificates", name: "Certificados", visible: true },
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const updateSettings = async (newSettings: Partial<UserSettingsViewModel>) => {
    const previousSettings = settings;
    setSettings(prev => prev ? { ...prev, ...newSettings } : null);

    try {
      const updateReq: UpdateUserSettingsRequestDTO = {};
      if (newSettings.language !== undefined) {
        updateReq.language = (["es", "en", "pt"].includes(newSettings.language) ? newSettings.language : "es") as any;
      }
      if (newSettings.tone !== undefined) updateReq.tone = newSettings.tone as any;
      if (newSettings.template !== undefined) updateReq.template = newSettings.template as any;
      if (newSettings.sectionsOrder !== undefined) {
        updateReq.sections_order = newSettings.sectionsOrder.map(s => ({ 
          id: s.id as any, 
          visible: s.visible ?? true 
        }));
      }

      await apiFetch("/users/me/settings", {
        method: "PATCH",
        body: JSON.stringify(updateReq),
      });

      await fetchSettings();
    } catch (err) {
      console.error("Error updating settings:", err);
      setSettings(previousSettings);
    }
  };

  return { settings, loading, updateSettings, refreshSettings: fetchSettings };
}
