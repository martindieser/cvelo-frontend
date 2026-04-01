import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { UserProfileDTO, MatchesDTO } from "@/lib/dtos";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Briefcase, GraduationCap, Award, Languages, Code2, FolderGit2, Sparkles, Plus, Trash2, AlertTriangle, ArrowLeft } from "lucide-react";

interface ValidationIntermediaryProps {
  profile: UserProfileDTO;
  initialMatches: MatchesDTO;
  jobInfo: {
    job_name: string;
    company_name: string;
    keywords: string[];
  };
  onApprove: (matches: MatchesDTO) => void;
  onBack?: () => void;
  isSubmitting?: boolean;
}

export default function ValidationIntermediary({ 
  profile, 
  initialMatches, 
  jobInfo,
  onApprove,
  onBack,
  isSubmitting = false
}: ValidationIntermediaryProps) {
  const [matches, setMatches] = useState<MatchesDTO>(initialMatches);

  // Helper to ensure details is an array
  const getDetailsArray = (details: any): string[] => {
    if (Array.isArray(details)) return details;
    if (typeof details === 'string') return details.split('\n').filter(line => line.trim() !== '');
    return [];
  };

  // Toggle Entire Experience
  const toggleExperience = (index: number) => {
    setMatches(prev => {
      const isSelected = prev.experience.some(e => e.index === index);
      if (isSelected) {
        return { ...prev, experience: prev.experience.filter(e => e.index !== index) };
      } else {
        // When adding back, include all bullets by default
        const details = getDetailsArray(profile.experience[index].details);
        return {
          ...prev,
          experience: [...prev.experience, { index, surviving_bullet_indices: details.map((_, i) => i) }]
        };
      }
    });
  };

  // Toggle Entire Project
  const toggleProject = (index: number) => {
    setMatches(prev => {
      const isSelected = prev.projects.some(p => p.index === index);
      if (isSelected) {
        return { ...prev, projects: prev.projects.filter(p => p.index !== index) };
      } else {
        const details = getDetailsArray(profile.projects[index].details);
        return {
          ...prev,
          projects: [...prev.projects, { index, surviving_bullet_indices: details.map((_, i) => i) }]
        };
      }
    });
  };

  const toggleItem = (field: keyof Omit<MatchesDTO, 'experience' | 'projects'>, index: number) => {
    setMatches(prev => {
      const current = prev[field] as number[];
      if (current.includes(index)) {
        return { ...prev, [field]: current.filter(i => i !== index) };
      } else {
        return { ...prev, [field]: [...current, index].sort((a, b) => a - b) };
      }
    });
  };

  const isAiRecommended = (type: 'experience' | 'projects', index: number) => {
    return initialMatches[type].some(m => m.index === index);
  };

  const hasNoMatches = initialMatches.experience.length === 0 && initialMatches.projects.length === 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 text-left">
      {onBack && (
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors shrink-0 mb-2"
        >
          <ArrowLeft className="w-4 h-4" /> <span>Volver a la descripción</span>
        </button>
      )}

      <div className="bg-primary/5 border border-primary/10 rounded-3xl p-6 md:p-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-xl">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-black italic tracking-tight">Personaliza tu Selección</h3>
            <p className="text-sm text-muted-foreground">La IA ha seleccionado lo mejor de tu perfil para <strong>{jobInfo.job_name}</strong>. Puedes quitar o añadir secciones según prefieras.</p>
          </div>
        </div>
        
        {jobInfo.keywords.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {jobInfo.keywords.map((kw, i) => (
              <Badge key={i} variant="secondary" className="bg-background border-primary/20 text-primary text-[10px] font-bold px-3 py-1 uppercase tracking-wider">
                {kw}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {hasNoMatches && (
        <Alert className="rounded-3xl border-amber-200 bg-amber-50 text-amber-900 border-2 p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="bg-amber-200 p-2 rounded-xl shrink-0">
              <AlertTriangle className="h-6 w-6 text-amber-700" />
            </div>
            <div className="space-y-1">
              <AlertTitle className="font-black text-amber-700 uppercase tracking-tight text-sm">
                Aviso de Compatibilidad
              </AlertTitle>
              <AlertDescription className="text-sm font-medium opacity-90 leading-relaxed">
                Nuestra IA no ha detectado experiencias o proyectos en tu perfil que coincidan directamente con los requisitos de esta vacante. 
                <br /><br />
                <span className="font-bold">Tu perfil podría no estar dentro de lo que busca la empresa para este puesto específico.</span> Puedes seleccionar manualmente lo que desees incluir, pero te recomendamos revisar si esta oferta es la adecuada para tu experiencia actual.
              </AlertDescription>
            </div>
          </div>
        </Alert>
      )}


      <ScrollArea className="h-[550px] pr-4">
        <div className="space-y-10">
          {/* Experiencia */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-primary">
                <Briefcase className="w-5 h-5" />
                <h4 className="font-black text-lg uppercase tracking-tight">Experiencia Laboral</h4>
              </div>
              <Badge variant="outline" className="rounded-full px-3 py-1 text-[10px] font-bold opacity-60">
                {matches.experience.length} seleccionadas
              </Badge>
            </div>
            <div className="grid gap-4">
              {profile.experience.map((exp, i) => {
                const isSelected = matches.experience.some(m => m.index === i);
                const isRecommended = isAiRecommended('experience', i);
                return (
                  <Card 
                    key={i} 
                    onClick={() => !isSelected && toggleExperience(i)}
                    className={`rounded-2xl border-2 transition-all cursor-pointer overflow-hidden ${
                      isSelected 
                        ? 'border-primary bg-primary/[0.02] shadow-md' 
                        : 'border-muted bg-muted/20 opacity-50 grayscale hover:grayscale-0 hover:border-primary/30'
                    }`}
                  >
                    <CardHeader className="p-5 pb-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-base font-bold">{exp.role}</CardTitle>
                            {isRecommended && (
                              <Badge className="bg-primary/10 text-primary text-[9px] font-black uppercase tracking-tighter border-none px-2 py-0 h-4">
                                <Sparkles className="w-2 h-2 mr-1" /> IA
                              </Badge>
                            )}
                          </div>
                          <CardDescription className="font-medium text-primary/80">{exp.company}</CardDescription>
                        </div>
                        <Button 
                          size="icon" 
                          variant={isSelected ? "destructive" : "outline"}
                          className={`rounded-xl h-10 w-10 shrink-0 transition-all ${isSelected ? 'shadow-lg shadow-destructive/10' : 'border-primary/20 text-primary'}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExperience(i);
                          }}
                        >
                          {isSelected ? <Trash2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                        </Button>
                      </div>
                    </CardHeader>
                    {isSelected && (
                      <CardContent className="p-5 pt-0">
                        <Separator className="bg-primary/10 mb-4" />
                        <ul className="space-y-2">
                          {getDetailsArray(exp.details).map((detail, dIdx) => (
                            <li key={dIdx} className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
                              <div className="w-1 h-1 rounded-full bg-primary/40 mt-1.5 shrink-0" />
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>
          </section>

          {/* Proyectos */}
          {profile.projects.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-primary">
                  <FolderGit2 className="w-5 h-5" />
                  <h4 className="font-black text-lg uppercase tracking-tight">Proyectos</h4>
                </div>
                <Badge variant="outline" className="rounded-full px-3 py-1 text-[10px] font-bold opacity-60">
                  {matches.projects.length} seleccionados
                </Badge>
              </div>
              <div className="grid gap-4">
                {profile.projects.map((proj, i) => {
                  const isSelected = matches.projects.some(m => m.index === i);
                  const isRecommended = isAiRecommended('projects', i);
                  return (
                    <Card 
                      key={i} 
                      onClick={() => !isSelected && toggleProject(i)}
                      className={`rounded-2xl border-2 transition-all cursor-pointer overflow-hidden ${
                        isSelected 
                          ? 'border-primary bg-primary/[0.02] shadow-md' 
                          : 'border-muted bg-muted/20 opacity-50 grayscale hover:grayscale-0 hover:border-primary/30'
                      }`}
                    >
                      <CardHeader className="p-5 pb-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-base font-bold">{proj.title}</CardTitle>
                              {isRecommended && (
                                <Badge className="bg-primary/10 text-primary text-[9px] font-black uppercase tracking-tighter border-none px-2 py-0 h-4">
                                  <Sparkles className="w-2 h-2 mr-1" /> IA
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Button 
                            size="icon" 
                            variant={isSelected ? "destructive" : "outline"}
                            className={`rounded-xl h-10 w-10 shrink-0 transition-all ${isSelected ? 'shadow-lg shadow-destructive/10' : 'border-primary/20 text-primary'}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleProject(i);
                            }}
                          >
                            {isSelected ? <Trash2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                          </Button>
                        </div>
                      </CardHeader>
                      {isSelected && (
                        <CardContent className="p-5 pt-0">
                          <Separator className="bg-primary/10 mb-4" />
                          <ul className="space-y-2">
                            {getDetailsArray(proj.details).map((detail, dIdx) => (
                              <li key={dIdx} className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
                                <div className="w-1 h-1 rounded-full bg-primary/40 mt-1.5 shrink-0" />
                                {detail}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      )}
                    </Card>
                  );
                })}
              </div>
            </section>
          )}

          {/* Habilidades */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <Code2 className="w-5 h-5" />
              <h4 className="font-black text-lg uppercase tracking-tight">Habilidades Sugeridas</h4>
            </div>
            <div className="flex flex-wrap gap-2 bg-muted/30 p-5 rounded-3xl border-2 border-dashed border-muted">
              {profile.skills.map((skill, i) => {
                const isSelected = matches.skills_indices.includes(i);
                const isRecommended = initialMatches.skills_indices.includes(i);
                return (
                  <Badge 
                    key={i} 
                    onClick={() => toggleItem('skills_indices', i)}
                    variant={isSelected ? "default" : "outline"}
                    className={`cursor-pointer px-4 py-2 rounded-xl font-bold transition-all border-2 relative ${
                      isSelected 
                        ? 'bg-primary border-primary shadow-md' 
                        : 'text-muted-foreground border-muted hover:border-primary/30'
                    }`}
                  >
                    {skill}
                    {isRecommended && !isSelected && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse" />
                    )}
                  </Badge>
                );
              })}
            </div>
          </section>

          {/* Otros (Compacto) */}
          <div className="grid md:grid-cols-2 gap-8">
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-primary">
                <GraduationCap className="w-5 h-5" />
                <h4 className="font-black text-lg uppercase tracking-tight">Educación</h4>
              </div>
              <div className="space-y-2">
                {profile.education.map((edu, i) => {
                  const isSelected = matches.education_indices.includes(i);
                  return (
                    <div 
                      key={i} 
                      onClick={() => toggleItem('education_indices', i)}
                      className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all ${
                        isSelected ? 'border-primary/20 bg-primary/5' : 'border-muted opacity-40 grayscale'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <p className="font-bold text-xs leading-tight">{edu.degree}</p>
                        <p className="text-[10px] text-muted-foreground">{edu.institution}</p>
                      </div>
                      <Checkbox checked={isSelected} className="rounded-md" />
                    </div>
                  );
                })}
              </div>
            </section>

            <div className="space-y-8">
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <Award className="w-5 h-5" />
                  <h4 className="font-black text-lg uppercase tracking-tight">Certificados</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.certificates.map((cert, i) => {
                    const isSelected = matches.certificates_indices.includes(i);
                    return (
                      <Badge 
                        key={i} 
                        onClick={() => toggleItem('certificates_indices', i)}
                        variant={isSelected ? "default" : "outline"}
                        className={`cursor-pointer px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                          isSelected ? 'bg-primary border-primary' : 'text-muted-foreground opacity-50'
                        }`}
                      >
                        {cert}
                      </Badge>
                    );
                  })}
                </div>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <Languages className="w-5 h-5" />
                  <h4 className="font-black text-lg uppercase tracking-tight">Idiomas</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.languages.map((lang, i) => {
                    const isSelected = matches.languages_indices.includes(i);
                    return (
                      <Badge 
                        key={i} 
                        onClick={() => toggleItem('languages_indices', i)}
                        variant={isSelected ? "default" : "outline"}
                        className={`cursor-pointer px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                          isSelected ? 'bg-primary border-primary' : 'text-muted-foreground opacity-50'
                        }`}
                      >
                        {lang.name}
                      </Badge>
                    );
                  })}
                </div>
              </section>
            </div>
          </div>
        </div>
      </ScrollArea>

      <div className="pt-6 border-t border-border space-y-3">
        <Button 
          onClick={() => onApprove(matches)} 
          disabled={isSubmitting}
          className="w-full py-8 rounded-2xl font-black text-xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.01] active:scale-95"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              Procesando...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6" />
              Generar CV con esta selección
            </div>
          )}
        </Button>
        <p className="text-center text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-60">
          Tu perfil maestro no cambiará, solo este currículum específico.
        </p>
      </div>
    </div>
  );
}
