import { useState } from "react";
import { useUserProfile } from "@/hooks/useUserProfile";
import LoadingScreen from "@/components/LoadingScreen";

// Nuevos componentes refactorizados
import GeneralSection from "@/components/cv-editor/GeneralSection";
import SummarySection from "@/components/cv-editor/SummarySection";
import ExperienceSection from "@/components/cv-editor/ExperienceSection";
import EducationSection from "@/components/cv-editor/EducationSection";
import SkillsSection from "@/components/cv-editor/SkillsSection";
import SocialLinksSection from "@/components/cv-editor/SocialLinksSection";
import LanguagesSection from "@/components/cv-editor/LanguagesSection";
import ProjectsSection from "@/components/cv-editor/ProjectsSection";
import CertificatesSection from "@/components/cv-editor/CertificatesSection";
import DeleteConfirmDialog from "@/components/cv-editor/DeleteConfirmDialog";

const PersonalInfo = () => {
  const { profile, updateProfile, loading } = useUserProfile();

  // Estados para confirmación de borrado
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteContext, setDeleteContext] = useState<{
    type: 'experience' | 'education' | 'social' | 'language' | 'project';
    id: string;
    name: string;
  } | null>(null);

  if (loading && !profile) {
    return <LoadingScreen fullScreen={false} message="Cargando tu información" />;
  }

  if (!profile) return null;

  // Handlers para confirmación de borrado
  const openDeleteConfirm = (type: 'experience' | 'education' | 'social' | 'language' | 'project', id: string, name: string) => {
    setDeleteContext({ type, id, name });
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deleteContext) return;

    const { type, id } = deleteContext;
    if (type === 'experience') {
      updateProfile({ experience: profile.experience.filter(e => e.id !== id) });
    } else if (type === 'education') {
      updateProfile({ education: profile.education.filter(e => e.id !== id) });
    } else if (type === 'social') {
      updateProfile({ socialLinks: profile.socialLinks.filter(s => s.id !== id) });
    } else if (type === 'language') {
      updateProfile({ languages: profile.languages.filter(l => l.id !== id) });
    } else if (type === 'project') {
      updateProfile({ projects: profile.projects.filter(p => p.id !== id) });
    }

    setIsDeleteDialogOpen(false);
    setDeleteContext(null);
  };

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500 font-body">
      <div className="space-y-2 text-center lg:text-left">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Información Personal</h1>
        <p className="text-muted-foreground">
          Gestiona los datos que se utilizan para generar tus currículums. Mantenlos actualizados para mejores resultados.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUMNA IZQUIERDA: Info Básica y Redes */}
        <div className="lg:col-span-1 space-y-8">
          <GeneralSection 
            data={{ name: profile.name, email: profile.email, location: profile.location, phone: profile.phone }} 
            onSave={(data) => updateProfile(data)} 
          />
          
          <SocialLinksSection 
            items={profile.socialLinks} 
            onAdd={(item) => updateProfile({ socialLinks: [...profile.socialLinks, item] })}
            onUpdate={(item) => updateProfile({ socialLinks: profile.socialLinks.map(s => s.id === item.id ? item : s) })}
            onDelete={(id, name) => openDeleteConfirm('social', id, name)}
          />

          <SkillsSection 
            items={profile.skills} 
            onSave={(skills) => updateProfile({ skills })} 
          />
        </div>

        {/* COLUMNA DERECHA: Resumen, Experiencia, etc */}
        <div className="lg:col-span-2 space-y-8">
          <SummarySection 
            value={profile.summary} 
            onSave={(summary) => updateProfile({ summary })} 
          />

          <ExperienceSection 
            items={profile.experience}
            onAdd={(item) => updateProfile({ experience: [...profile.experience, item] })}
            onUpdate={(item) => updateProfile({ experience: profile.experience.map(e => e.id === item.id ? item : e) })}
            onDelete={(id, name) => openDeleteConfirm('experience', id, name)}
          />

          <ProjectsSection 
            items={profile.projects}
            onAdd={(item) => updateProfile({ projects: [...profile.projects, item] })}
            onUpdate={(item) => updateProfile({ projects: profile.projects.map(p => p.id === item.id ? item : p) })}
            onDelete={(id, name) => openDeleteConfirm('project', id, name)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <EducationSection 
              items={profile.education}
              onAdd={(item) => updateProfile({ education: [...profile.education, item] })}
              onUpdate={(item) => updateProfile({ education: profile.education.map(e => e.id === item.id ? item : e) })}
              onDelete={(id, name) => openDeleteConfirm('education', id, name)}
            />

            <LanguagesSection 
              items={profile.languages}
              onAdd={(item) => updateProfile({ languages: [...profile.languages, item] })}
              onUpdate={(item) => updateProfile({ languages: profile.languages.map(l => l.id === item.id ? item : l) })}
              onDelete={(id, name) => openDeleteConfirm('language', id, name)}
            />
          </div>

          <CertificatesSection 
            items={profile.certificates} 
            onSave={(certificates) => updateProfile({ certificates })} 
          />
        </div>
      </div>

      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        itemName={deleteContext?.name}
      />
    </div>
  );
};

export default PersonalInfo;
