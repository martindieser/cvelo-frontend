import { useState, useEffect } from "react";
import { UserProfileViewModel, AdaptedResumeViewModel } from "@/lib/viewmodels";
import { UserProfileDTO, UpdateUserProfileRequestDTO, ExperienceItemDTO, EducationItemDTO, LanguageItemDTO, SocialLinkDTO } from "@/lib/dtos";
import { apiFetch } from "@/lib/apiClient";

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfileViewModel | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const data: UserProfileDTO = await apiFetch("/users/me/profile");
      
      const mappedProfile: UserProfileViewModel = {
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
          sectionsOrder: data.settings.sections_order.map(s => ({ id: s.id, name: s.id.charAt(0).toUpperCase() + s.id.slice(1) }))
        },
        adaptedResumes: data.adapted_resumes.map(r => ({
          id: r.id,
          companyName: r.company_name,
          resumeName: r.job_name,
          date: r.date
        }))
      };

      setProfile(mappedProfile);
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const updateProfile = async (newProfile: Partial<UserProfileViewModel>) => {
    // Optimistic update
    const previousProfile = profile;
    setProfile(prev => prev ? { ...prev, ...newProfile } : null);

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

      await apiFetch("/users/me/profile", {
        method: "PATCH",
        body: JSON.stringify(updateReq),
      });
      
      // Refresh to ensure we have the latest from server
      await fetchProfile();
    } catch (err) {
      console.error("Error updating profile:", err);
      // Rollback
      setProfile(previousProfile);
    }
  };

  return { profile, updateProfile, loading, refreshProfile: fetchProfile };
}
