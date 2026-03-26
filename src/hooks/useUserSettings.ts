import { useState, useEffect } from "react";
import { UserSettingsViewModel } from "@/lib/viewmodels";

const mockSettings: UserSettingsViewModel = {
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
};

export function useUserSettings() {
  const [settings, setSettings] = useState<UserSettingsViewModel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 400));
      setSettings(mockSettings);
      setLoading(false);
    };

    fetchSettings();
  }, []);

  const updateSettings = async (newSettings: Partial<UserSettingsViewModel>) => {
    setSettings(prev => prev ? { ...prev, ...newSettings } : null);
    console.log("Settings updated:", newSettings);
  };

  return { settings, loading, updateSettings };
}
