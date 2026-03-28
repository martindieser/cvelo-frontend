import { useState, useEffect } from "react";
import { UserSettingsViewModel } from "@/lib/viewmodels";
import { UserSettingsDTO, UpdateUserSettingsRequestDTO } from "@/lib/dtos";
import { apiFetch } from "@/lib/apiClient";

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
          name: s.id.charAt(0).toUpperCase() + s.id.slice(1) 
        }))
      };

      setSettings(mappedSettings);
    } catch (err) {
      console.error("Error fetching settings:", err);
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
      if (newSettings.language !== undefined) updateReq.language = newSettings.language as any;
      if (newSettings.tone !== undefined) updateReq.tone = newSettings.tone as any;
      if (newSettings.template !== undefined) updateReq.template = newSettings.template as any;
      if (newSettings.sectionsOrder !== undefined) {
        updateReq.sections_order = newSettings.sectionsOrder.map(s => ({ id: s.id as any, visible: true }));
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
