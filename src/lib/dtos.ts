/**
 * Data Transfer Objects (DTOs) for CurriAI
 * These represent the raw data structure for API communication, following snake_case where the API requires.
 */

// --- Auth DTOs ---

export interface AuthUserResponseDTO {
  id: string;
  name: string;
  email: string;
}

export interface LoginRequestDTO {
  email: string;
  password?: string;
}

export interface LoginResponseDTO {
  user: AuthUserResponseDTO;
  token: string;
}

export interface RegisterRequestDTO {
  name: string;
  email: string;
  password?: string;
}

export interface RegisterResponseDTO {
  message: string;
  user_id: string;
  email: string;
  is_confirmed: boolean;
}

// --- User Profile & Settings DTOs ---

export interface SocialLinkDTO {
  platform: string;
  url: string | null;
}

export interface ExperienceItemDTO {
  role: string;
  company: string;
  period: string;
  details: string[];
}

export interface EducationItemDTO {
  degree: string;
  institution: string;
  period: string;
}

export interface LanguageItemDTO {
  name: string;
  level: string;
}

export interface ProjectItemDTO {
  title: string;
  details: string[];
  technologies?: string[];
  link?: string | null;
  period?: string | null;
}

export interface SectionOrderItemDTO {
  id: "summary" | "education" | "experience" | "certificates" | "skills" | "projects" | "languages";
  visible?: boolean;
}

export interface UserSettingsDTO {
  language: "es" | "en" | "pt";
  tone: "formal" | "informal" | "professional" | "witty";
  template: "harvard";
  sections_order: SectionOrderItemDTO[];
}

export interface UserProfileDTO {
  name: string | null;
  email: string;
  credits: number;
  avatar: string | null;
  location: string | null;
  phone: string | null;
  summary: string | null;
  skills: string[];
  social_links: SocialLinkDTO[];
  experience: ExperienceItemDTO[];
  projects: ProjectItemDTO[];
  education: EducationItemDTO[];
  languages: LanguageItemDTO[];
  certificates: string[];
  settings: UserSettingsDTO;
  adapted_resumes: AdaptedResumeDTO[];
}

export interface UpdateUserProfileRequestDTO {
  name?: string | null;
  avatar?: string | null;
  location?: string | null;
  phone?: string | null;
  summary?: string | null;
  skills?: string[] | null;
  social_links?: SocialLinkDTO[] | null;
  experience?: ExperienceItemDTO[] | null;
  education?: EducationItemDTO[] | null;
  languages?: LanguageItemDTO[] | null;
  certificates?: string[] | null;
}

export interface UpdateUserSettingsRequestDTO {
  language?: "es" | "en" | "pt" | null;
  tone?: "formal" | "informal" | "professional" | "witty" | null;
  template?: "harvard" | null;
  sections_order?: SectionOrderItemDTO[] | null;
}

// --- Resume & Tailoring DTOs ---

export interface AdaptedResumeDTO {
  id: string;
  company_name: string;
  job_name: string;
  date: string;
}

export interface UpdateAdaptedResumeRequestDTO {
  company_name?: string | null;
  resume_name?: string | null;
}

export interface TailoredResumeDTO {
  resume_id?: string;
  job_name: string;
  company_name: string;
  date: string;
  summary: string | null;
  optimized_skills: string[];
  optimized_experience: ExperienceItemDTO[];
  optimized_projects: ProjectItemDTO[];
  optimized_education: EducationItemDTO[];
  optimized_languages: LanguageItemDTO[];
  optimized_certificates: string[];
  detected_keywords: string[];
  applied_changes: AppliedChangeDTO[];
}

export interface AppliedChangeDTO {
  section: string;
  description: string[];
}

export interface EnhanceResumeRequestDTO {
  job_description: string;
}

export interface UploadResponseDTO {
  file_id: string;
}

export interface ProcessResumeRequestDTO {
  file_id: string;
}

// --- Task & Async DTOs ---

export type TaskStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

export interface TaskResponseDTO {
  task_id: string;
}

export interface TaskStatusDTO {
  task_id: string;
  status: TaskStatus;
  result?: any;
  error?: string | null;
  created_at: string;
}

// --- Payment & Checkout DTOs ---

export interface CreateCheckoutRequestDTO {
  pack_id: string;
}

export interface CheckoutResponseDTO {
  id: string;
  invoice_url: string;
  qr_code: string;
  amount: number;
  currency: string;
}

export type PaymentStatus = "pending" | "approved" | "rejected" | "expired" | "cancelled";

export interface PaymentStatusDTO {
  id: string;
  status: PaymentStatus;
}
