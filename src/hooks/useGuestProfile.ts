import { useState, useEffect } from "react";
import { UserProfileViewModel, SectionViewModel } from "@/lib/viewmodels";

const GUEST_STORAGE_KEY = "CVealo_guest_profile";

const INITIAL_GUEST_PROFILE: UserProfileViewModel = {
  name: "",
  email: "",
  credits: 0,
  avatar: "",
  location: "",
  phone: "",
  summary: "",
  skills: [],
  socialLinks: [],
  experience: [],
  education: [],
  languages: [],
  projects: [],
  certificates: [],
  settings: {
    language: "es",
    tone: "professional",
    template: "harvard",
    sectionsOrder: []
  }
};

export function useGuestProfile() {
  const [profile, setProfile] = useState<UserProfileViewModel>(() => {
    const saved = localStorage.getItem(GUEST_STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_GUEST_PROFILE;
  });

  useEffect(() => {
    localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(profile));
  }, [profile]);

  const updateProfile = (updates: Partial<UserProfileViewModel>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const updateSettings = (settings: Partial<UserProfileViewModel["settings"]>) => {
    setProfile(prev => ({
      ...prev,
      settings: { ...prev.settings, ...settings }
    }));
  };

  const resetProfile = () => {
    setProfile(INITIAL_GUEST_PROFILE);
    localStorage.removeItem(GUEST_STORAGE_KEY);
  };

  return { profile, updateProfile, updateSettings, resetProfile };
}
