/**
 * ViewModels for CurriAI
 * These structures represent the data exactly as it is consumed and displayed by the frontend components.
 */

// --- Auth & Session ViewModels ---

export interface AuthUserViewModel {
  id: string;
  name: string;
  email: string;
}

// --- Dashboard & User Data ViewModels ---

export interface SocialLinkViewModel {
  id: string;
  platform: string;
  url: string;
}

export interface WorkExperienceViewModel {
  id: string;
  role: string;
  company: string;
  period: string;
  details: string; // Typically a newline-separated or bullet-point string
}

export interface EducationViewModel {
  id: string;
  degree: string;
  institution: string;
  period: string;
}

export interface LanguageViewModel {
  id: string;
  name: string;
  level: string;
}

export interface SectionViewModel {
  id: string;
  name: string;
}

/**
 * User specific preferences for CV generation
 */
export interface UserSettingsViewModel {
  language: string;
  tone: string;
  template: string;
  sectionsOrder: SectionViewModel[];
}

/**
 * The base profile of the user (their "Master" data)
 */
export interface UserProfileViewModel {
  name: string;
  email: string;
  avatar?: string;
  credits: number;
  location: string;
  phone: string;
  summary: string;
  skills: string[];
  socialLinks: SocialLinkViewModel[];
  experience: WorkExperienceViewModel[];
  education: EducationViewModel[];
  languages: LanguageViewModel[];
  certificates: string[];
  settings: UserSettingsViewModel; // User settings integrated into profile
  adaptedResumes: AdaptedResumeViewModel[]; // List of historical documents
}

/**
 * Represents a specific section change insight
 */
export interface AppliedChangeViewModel {
  section: string;
  description: string;
}

/**
 * THE CORE VIEWMODEL: A tailored resume result
 * This combines user data with AI-optimized content and insights.
 */
export interface TailoredResumeViewModel {
  id: string;
  jobName: string;
  companyName: string;
  date: string;
  
  // Optimized Content (The "result" of the AI)
  optimizedSummary: string;
  optimizedExperience: WorkExperienceViewModel[];
  optimizedSkills: string[];
  optimizedEducation: EducationViewModel[];
  optimizedLanguages: LanguageViewModel[];
  optimizedCertificates: string[];
  
  // Metadata & Insights
  detectedKeywords: string[];
  appliedChanges: AppliedChangeViewModel[];
  
  // Reference to base data if needed
  baseProfile: UserProfileViewModel;
}

/**
 * Used in MyDocuments.tsx to display the list of generated resumes
 */
export interface AdaptedResumeViewModel {
  id: string;
  companyName: string;
  resumeName: string;
  date: string;
}

// --- Landing Page ViewModels ---

export interface PricingPlanViewModel {
  name: string;
  price: string;
  period?: string;
  isRecommended?: boolean;
  features: string[];
  ctaText?: string;
  ctaLink: string;
}

export interface TestimonialViewModel {
  name: string;
  date: string;
  text: string;
  avatar: string;
  rating?: number;
}

export interface FAQViewModel {
  question: string;
  answer: string;
}

export interface FeatureViewModel {
  icon: any; 
  title: string;
  description: string;
}

export interface StepViewModel {
  num: string;
  title: string;
  subtitle?: string;
  image: string;
}

export interface ExpertViewModel {
  name: string;
  role: string;
  avatar: string;
  description: string[];
  contactLink?: string;
}
