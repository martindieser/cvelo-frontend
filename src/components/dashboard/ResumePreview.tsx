import { ArrowLeft, Download, Pencil, Check, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { InsightsContent } from "./InsightsPanel";
import { TailoredResumeViewModel } from "@/lib/viewmodels";

interface ResumePreviewProps {
  onBack: () => void;
  data: TailoredResumeViewModel;
}

const ResumePreview = ({ onBack, data }: ResumePreviewProps) => {
  const { 
    baseProfile, 
    optimizedSummary, 
    optimizedExperience, 
    optimizedSkills,
    optimizedEducation,
    optimizedLanguages,
    optimizedCertificates,
    jobName, 
    detectedKeywords, 
    appliedChanges 
  } = data;

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors shrink-0"
        >
          <ArrowLeft className="w-4 h-4" /> <span className="hidden sm:inline">Volver a la lista</span>
        </button>
        
        <div className="flex items-center gap-2">
          <div className="xl:hidden">
            <Drawer>
              <DrawerTrigger asChild>
                <Button className="gap-2 rounded-xl font-bold bg-primary/10 text-primary hover:bg-primary/20 border-none h-9 lg:h-10 text-xs lg:text-sm px-3 lg:px-4 shrink-0 shadow-none">
                  <Sparkles className="w-4 h-4" /> <span>Insights</span>
                </Button>
              </DrawerTrigger>
              <DrawerContent className="rounded-t-[32px] border-t-border bg-background max-h-[85vh]">
                <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted mt-4 mb-4" />
                <DrawerHeader className="text-left px-6">
                  <DrawerTitle className="text-xl font-bold flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Insights de CurriAI
                  </DrawerTitle>
                </DrawerHeader>
                <div className="px-6 overflow-y-auto custom-scrollbar pb-10">
                  <InsightsContent keywords={detectedKeywords} changes={appliedChanges} />
                </div>
              </DrawerContent>
            </Drawer>
          </div>

          <Button variant="outline" className="gap-2 rounded-xl font-bold border-border hover:bg-card h-9 lg:h-10 text-xs lg:text-sm px-3 lg:px-4 shrink-0">
            <Download className="w-4 h-4" /> <span className="hidden sm:inline">Descargar PDF</span><span className="sm:hidden">PDF</span>
          </Button>
        </div>
      </div>

      <div className="space-y-1 text-left">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          CV ADAPTADO PARA
        </span>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl lg:text-4xl font-bold tracking-tight truncate max-w-[250px] lg:max-w-none">{jobName}</h1>
            <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors shrink-0">
              <Pencil className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex-1 sm:flex-none p-2 rounded-xl bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors flex justify-center">
              <Check className="w-5 h-5" />
            </button>
            <button className="flex-1 sm:flex-none p-2 rounded-xl bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20 transition-colors flex justify-center">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <Card className="border-border shadow-xl rounded-2xl overflow-hidden bg-white mx-auto">
        <div className="bg-muted/30 border-b border-border px-4 lg:px-6 py-3 flex items-center justify-between">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-destructive/40"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-warning/40"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-primary/40"></div>
          </div>
          <Button variant="ghost" size="sm" className="text-[10px] lg:text-xs h-7 lg:h-8 gap-2 font-bold text-muted-foreground px-2">
            <Pencil className="w-3 h-3 lg:w-3.5 h-3.5" /> Editar contenido
          </Button>
        </div>
        <CardContent className="p-6 lg:p-12 space-y-6 lg:space-y-10 text-[#2d3748] text-left">
          {/* Header */}
          <div className="space-y-2 border-b-2 border-primary/20 pb-6">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground">{baseProfile.name}</h2>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs lg:text-sm text-muted-foreground font-medium">
              <span>{baseProfile.email}</span>
              <span className="hidden sm:inline">•</span>
              <span>{baseProfile.phone}</span>
              <span className="hidden sm:inline">•</span>
              {baseProfile.socialLinks.map((link, i) => (
                <span key={link.id} className="flex items-center gap-4">
                  <a href={link.url} className="text-primary hover:underline">{link.platform}</a>
                  {i < baseProfile.socialLinks.length - 1 && <span className="hidden sm:inline text-muted-foreground">•</span>}
                </span>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-3">
            <h3 className="text-[10px] lg:text-sm font-bold text-primary uppercase tracking-widest">Resumen Profesional</h3>
            <p className="text-sm lg:text-base leading-relaxed text-foreground/90 whitespace-pre-line">
              {optimizedSummary}
            </p>
          </div>

          {/* Skills (Optimized) */}
          {optimizedSkills.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-[10px] lg:text-sm font-bold text-primary uppercase tracking-widest">Habilidades</h3>
              <div className="flex flex-wrap gap-2">
                {optimizedSkills.map((skill, i) => (
                  <Badge key={i} variant="outline" className="rounded-md border-primary/20 bg-primary/5 text-primary-foreground/80 font-semibold py-1">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Experience */}
          <div className="space-y-6">
            <h3 className="text-[10px] lg:text-sm font-bold text-primary uppercase tracking-widest">Experiencia Laboral</h3>
            <div className="space-y-8">
              {optimizedExperience.map((exp) => (
                <div key={exp.id} className="space-y-2">
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-1">
                    <h4 className="font-bold text-base lg:text-lg">{exp.role} <span className="font-medium text-muted-foreground text-sm lg:text-lg">· {exp.company}</span></h4>
                    <span className="text-[10px] lg:text-sm font-semibold text-muted-foreground">{exp.period}</span>
                  </div>
                  <ul className="list-disc list-outside ml-4 space-y-2 text-xs lg:text-sm leading-relaxed text-foreground/80 whitespace-pre-line">
                    {exp.details.split('\n').map((line, i) => (
                      <li key={i}>{line.replace(/^[-•]\s*/, '')}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-border/50 pt-8">
            {/* Education (Optimized) */}
            {optimizedEducation.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-[10px] lg:text-sm font-bold text-primary uppercase tracking-widest">Educación</h3>
                <div className="space-y-4">
                  {optimizedEducation.map((edu) => (
                    <div key={edu.id} className="space-y-1">
                      <h4 className="font-bold text-sm lg:text-base">{edu.degree}</h4>
                      <p className="text-xs text-muted-foreground font-medium">{edu.institution}</p>
                      <p className="text-[10px] font-semibold text-primary/70">{edu.period}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Languages (Optimized) */}
            {optimizedLanguages.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-[10px] lg:text-sm font-bold text-primary uppercase tracking-widest">Idiomas</h3>
                <div className="space-y-2">
                  {optimizedLanguages.map((lang) => (
                    <div key={lang.id} className="flex items-center justify-between text-sm">
                      <span className="font-bold">{lang.name}</span>
                      <span className="text-xs text-muted-foreground">{lang.level}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Certificates (Optimized) */}
          {optimizedCertificates.length > 0 && (
            <div className="space-y-4 border-t border-border/50 pt-8">
              <h3 className="text-[10px] lg:text-sm font-bold text-primary uppercase tracking-widest">Certificaciones</h3>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {optimizedCertificates.map((cert, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-medium text-foreground/80">
                    <div className="w-1 h-1 rounded-full bg-primary" />
                    {cert}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumePreview;
