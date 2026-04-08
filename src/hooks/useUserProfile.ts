import { useState, useEffect, useCallback } from "react";
import { UserProfileViewModel } from "@/lib/viewmodels";
import { UserProfileDTO, UpdateUserProfileRequestDTO } from "@/lib/dtos";
import { useApi } from "./useApi";
import { useAuth } from "./useAuth";
import { ApiError } from "@/lib/apiClient";

// Estado compartido fuera del hook para sincronizar todas las instancias
let sharedProfile: UserProfileViewModel | null = null;
let sharedLoading = true;
let sharedRefreshing = false;
let sharedError: ApiError | null = null;
const listeners = new Set<() => void>();

const notifyListeners = () => listeners.forEach(listener => listener());

export function useUserProfile() {
  const { apiCall } = useApi();
  const { isAuthenticated } = useAuth();
  
  // Estado local para disparar re-renders, pero sincronizado con el global
  const [profile, setProfile] = useState<UserProfileViewModel | null>(sharedProfile);
  const [loading, setLoading] = useState(sharedLoading);
  const [isRefreshing, setIsRefreshing] = useState(sharedRefreshing);
  const [error, setError] = useState<ApiError | null>(sharedError);

  useEffect(() => {
    const handleChange = () => {
      setProfile(sharedProfile);
      setLoading(sharedLoading);
      setIsRefreshing(sharedRefreshing);
      setError(sharedError);
    };
    listeners.add(handleChange);
    return () => {
      listeners.delete(handleChange);
    };
  }, []);

  const fetchProfile = useCallback(async (silent = false) => {
    if (!isAuthenticated) return;
    
    if (silent) {
      sharedRefreshing = true;
    } else {
      sharedLoading = true;
    }
    notifyListeners();
    
    sharedError = null;
    try {
      const data: UserProfileDTO = await apiCall("/users/me/profile");
      
      sharedProfile = {
        name: data.name ?? "",
        email: data.email,
        credits: data.credits,
        avatar: data.avatar ?? "",
        location: data.location ?? "",
        phone: data.phone ?? "",
        summary: data.summary ?? "",
        skills: data.skills,
        socialLinks: data.social_links.map((s, i) => ({ id: i.toString(), platform: s.platform, url: s.url ?? "" })),
        experience: data.experience.map((e, i) => ({ 
          id: i.toString(), 
          role: e.role, 
          company: e.company, 
          period: e.period, 
          details: e.details.join("\n") 
        })),
        education: data.education.map((edu, i) => ({ 
          id: i.toString(), 
          degree: edu.degree, 
          institution: edu.institution, 
          period: edu.period 
        })),
        languages: data.languages.map((l, i) => ({ 
          id: i.toString(), 
          name: l.name, 
          level: l.level 
        })),
        projects: data.projects.map((p, i) => ({
          id: i.toString(),
          title: p.title,
          details: p.details.join("\n"),
          technologies: p.technologies ?? [],
          link: p.link ?? "",
          period: p.period ?? ""
        })),
        certificates: data.certificates,
        settings: {
          language: data.settings.language,
          tone: data.settings.tone,
          template: data.settings.template,
          sectionsOrder: data.settings.sections_order.map(s => {
            const names: Record<string, string> = {
              summary: "Resumen",
              experience: "Experiencia",
              education: "Educación",
              skills: "Habilidades",
              languages: "Idiomas",
              projects: "Proyectos",
              certificates: "Certificaciones"
            };
            return { 
              id: s.id, 
              name: names[s.id] || (s.id.charAt(0).toUpperCase() + s.id.slice(1)), 
              visible: s.visible ?? true 
            };
          })
        }
      };
    } catch (err) {
      if (err instanceof ApiError) {
        sharedError = err;
      }
      console.error("Error fetching profile:", err);
    } finally {
      sharedLoading = false;
      sharedRefreshing = false;
      notifyListeners();
    }
  }, [apiCall, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      if (!sharedProfile && !sharedLoading) {
        fetchProfile();
      }
    } else {
      sharedProfile = null;
      sharedLoading = false;
      sharedRefreshing = false;
      notifyListeners();
    }
  }, [fetchProfile, isAuthenticated]);

  const updateProfile = async (newProfile: Partial<UserProfileViewModel>) => {
    const previousProfile = sharedProfile;
    sharedProfile = sharedProfile ? { ...sharedProfile, ...newProfile } : null;
    notifyListeners();

    try {
      const updateReq: UpdateUserProfileRequestDTO = {};
      if (newProfile.name !== undefined) updateReq.name = newProfile.name;
      if (newProfile.avatar !== undefined) updateReq.avatar = newProfile.avatar;
      if (newProfile.location !== undefined) updateReq.location = newProfile.location;
      if (newProfile.phone !== undefined) updateReq.phone = newProfile.phone;
      if (newProfile.summary !== undefined) updateReq.summary = newProfile.summary;
      if (newProfile.skills !== undefined) updateReq.skills = newProfile.skills;
      if (newProfile.certificates !== undefined) updateReq.certificates = newProfile.certificates;
      
      if (newProfile.socialLinks !== undefined) {
        updateReq.social_links = newProfile.socialLinks.map(s => ({ platform: s.platform, url: s.url }));
      }
      
      if (newProfile.experience !== undefined) {
        updateReq.experience = newProfile.experience.map(e => ({ 
          role: e.role, 
          company: e.company, 
          period: e.period, 
          details: e.details.split("\n") 
        }));
      }

      if (newProfile.education !== undefined) {
        updateReq.education = newProfile.education.map(edu => ({ 
          degree: edu.degree, 
          institution: edu.institution, 
          period: edu.period 
        }));
      }

      if (newProfile.languages !== undefined) {
        updateReq.languages = newProfile.languages.map(l => ({ 
          name: l.name, 
          level: l.level 
        }));
      }
      
      if (newProfile.projects !== undefined) {
        updateReq.projects = newProfile.projects.map(p => ({
          title: p.title,
          details: p.details.split("\n"),
          technologies: p.technologies,
          link: p.link,
          period: p.period
        }));
      }

      await apiCall("/users/me/profile", {
        method: "PATCH",
        body: JSON.stringify(updateReq),
      });
      
      await fetchProfile(true);
    } catch (err) {
      console.error("Error updating profile:", err);
      sharedProfile = previousProfile;
      notifyListeners();
    }
  };

  return { 
    profile, 
    updateProfile, 
    loading, 
    isRefreshing,
    error,
    isNewUser: error?.status === 404,
    refreshProfile: () => fetchProfile(true) 
  };
}
