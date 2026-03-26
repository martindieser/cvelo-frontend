import { useState } from "react";
import { 
  User, 
  Mail, 
  MapPin, 
  Phone, 
  Link as LinkIcon, 
  Plus, 
  Pencil, 
  Trash2, 
  Briefcase, 
  GraduationCap, 
  Languages, 
  Award,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { 
  UserProfileViewModel, 
  SocialLinkViewModel, 
  WorkExperienceViewModel, 
  EducationViewModel, 
  LanguageViewModel 
} from "@/lib/viewmodels";

const PersonalInfo = () => {
  // Estado hardcodeado inicial utilizando el ViewModel
  const [profile, setProfile] = useState<UserProfileViewModel>({
    name: "Juan Pérez",
    email: "juan.perez@gmail.com",
    location: "Madrid, España",
    phone: "+34 600 000 000",
    summary: "Cuento con más de 2 años de experiencia en atención al cliente, manejo de POS y uso básico de computadoras de escritorio, donde cumplí procesos definidos con puntualidad y responsabilidad. Busco iniciar mi trayectoria en ingeniería de software y estoy dispuesto a aprender sobre desarrollo en la nube, programación, APIs y herramientas de monitoreo para aportar en entornos dinámicos y desafiantes.",
    skills: ["React", "TypeScript", "Node.js", "SQL", "Git", "Customer Service", "POS Management"],
    socialLinks: [
      { id: "1", platform: "LinkedIn", url: "linkedin.com/in/juanperez" },
      { id: "2", platform: "Portfolio", url: "juanperez.dev" }
    ],
    experience: [
      { 
        id: "1", 
        role: "Cajero", 
        company: "Large Ducks Coffee", 
        period: "Junio 2023 – Actualidad",
        details: "Operé la caja registradora POS para cobrar a clientes y entregar cambio con precisión mientras preparaba alimentos y bebidas.\nManejé horarios de alta demanda mediante la multitarea y un servicio al cliente consistente.\nUtilicé una computadora de escritorio para gestionar correo electrónico interno y completar capacitaciones en línea."
      }
    ],
    education: [
      { id: "1", degree: "Bachillerato", institution: "Instituto Tecnológico", period: "2019 - 2021" }
    ],
    languages: [
      { id: "1", name: "Español", level: "Nativo" },
      { id: "2", name: "Inglés", level: "B2 - Intermedio Alto" }
    ],
    certificates: ["Certificado de Atención al Cliente", "Google Cloud Digital Leader"]
  });

  // Estados para diálogos
  const [isGeneralOpen, setIsGeneralOpen] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [isExperienceOpen, setIsExperienceOpen] = useState(false);
  const [isEducationOpen, setIsEducationOpen] = useState(false);
  const [isSocialOpen, setIsSocialOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isSkillOpen, setIsSkillOpen] = useState(false);
  const [isCertOpen, setIsCertOpen] = useState(false);

  // Estados para edición temporal
  const [tempGeneral, setGeneral] = useState({ name: profile.name, email: profile.email, location: profile.location, phone: profile.phone });
  const [tempSummary, setSummary] = useState(profile.summary);
  const [tempExp, setTempExp] = useState<WorkExperienceViewModel>({ id: "", role: "", company: "", period: "", details: "" });
  const [tempEdu, setTempEdu] = useState<EducationViewModel>({ id: "", degree: "", institution: "", period: "" });
  const [tempSocial, setTempSocial] = useState<SocialLinkViewModel>({ id: "", platform: "", url: "" });
  const [tempLang, setTempLang] = useState<LanguageViewModel>({ id: "", name: "", level: "" });
  const [tempSkills, setTempSkills] = useState(profile.skills.join(", "));
  const [tempCerts, setTempCerts] = useState(profile.certificates.join(", "));

  // Handlers
  const saveGeneral = () => {
    setProfile({ ...profile, ...tempGeneral });
    setIsGeneralOpen(false);
  };

  const saveSummary = () => {
    setProfile({ ...profile, summary: tempSummary });
    setIsSummaryOpen(false);
  };

  const deleteExp = (id: string) => {
    setProfile({ ...profile, experience: profile.experience.filter(e => e.id !== id) });
  };

  const saveExp = () => {
    if (tempExp.id) {
      setProfile({ ...profile, experience: profile.experience.map(e => e.id === tempExp.id ? tempExp : e) });
    } else {
      setProfile({ ...profile, experience: [...profile.experience, { ...tempExp, id: Math.random().toString() }] });
    }
    setIsExperienceOpen(false);
  };

  const deleteEdu = (id: string) => {
    setProfile({ ...profile, education: profile.education.filter(e => e.id !== id) });
  };

  const saveEdu = () => {
    if (tempEdu.id) {
      setProfile({ ...profile, education: profile.education.map(e => e.id === tempEdu.id ? tempEdu : e) });
    } else {
      setProfile({ ...profile, education: [...profile.education, { ...tempEdu, id: Math.random().toString() }] });
    }
    setIsEducationOpen(false);
  };

  const saveSocial = () => {
    if (tempSocial.id) {
      setProfile({ ...profile, socialLinks: profile.socialLinks.map(s => s.id === tempSocial.id ? tempSocial : s) });
    } else {
      setProfile({ ...profile, socialLinks: [...profile.socialLinks, { ...tempSocial, id: Math.random().toString() }] });
    }
    setIsSocialOpen(false);
  };

  const deleteSocial = (id: string) => {
    setProfile({ ...profile, socialLinks: profile.socialLinks.filter(s => s.id !== id) });
  };

  const saveSkills = () => {
    setProfile({ ...profile, skills: tempSkills.split(",").map(s => s.trim()).filter(s => s !== "") });
    setIsSkillOpen(false);
  };

  const saveLanguages = () => {
    if (tempLang.id) {
      setProfile({ ...profile, languages: profile.languages.map(l => l.id === tempLang.id ? tempLang : l) });
    } else {
      setProfile({ ...profile, languages: [...profile.languages, { ...tempLang, id: Math.random().toString() }] });
    }
    setIsLanguageOpen(false);
  };

  const deleteLang = (id: string) => {
    setProfile({ ...profile, languages: profile.languages.filter(l => l.id !== id) });
  };

  const saveCerts = () => {
    setProfile({ ...profile, certificates: tempCerts.split(",").map(c => c.trim()).filter(c => c !== "") });
    setIsCertOpen(false);
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
          
          {/* Información General */}
          <Card className="border-border shadow-sm rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-bold">General</CardTitle>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full"
                onClick={() => {
                  setGeneral({ name: profile.name, email: profile.email, location: profile.location, phone: profile.phone });
                  setIsGeneralOpen(true);
                }}
              >
                <Pencil className="h-4 w-4 text-muted-foreground" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1 text-left">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Nombre completo</p>
                <p className="text-sm font-medium">{profile.name}</p>
              </div>
              <div className="space-y-1 text-left">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Email</p>
                <p className="text-sm font-medium">{profile.email}</p>
              </div>
              <div className="space-y-1 text-left">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Ubicación</p>
                <p className="text-sm font-medium">{profile.location}</p>
              </div>
              <div className="space-y-1 text-left">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Teléfono</p>
                <p className="text-sm font-medium">{profile.phone}</p>
              </div>
            </CardContent>
          </Card>

          {/* Redes Sociales */}
          <Card className="border-border shadow-sm rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-bold">Links Sociales</CardTitle>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full"
                onClick={() => {
                  setTempSocial({ id: "", platform: "", url: "" });
                  setIsSocialOpen(true);
                }}
              >
                <Plus className="h-4 w-4 text-primary" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {profile.socialLinks.map((link) => (
                <div key={link.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center border border-border">
                      <Globe className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold">{link.platform}</p>
                      <p className="text-[10px] text-muted-foreground truncate max-w-[120px]">{link.url}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 rounded-lg"
                      onClick={() => {
                        setTempSocial(link);
                        setIsSocialOpen(true);
                      }}
                    >
                      <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteSocial(link.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Habilidades */}
          <Card className="border-border shadow-sm rounded-2xl text-left">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-bold">Habilidades</CardTitle>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full"
                onClick={() => {
                  setTempSkills(profile.skills.join(", "));
                  setIsSkillOpen(true);
                }}
              >
                <Pencil className="h-4 w-4 text-muted-foreground" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <Badge key={index} className="bg-primary/10 text-primary border-none font-bold px-3 py-1 rounded-full text-[10px]">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* COLUMNA DERECHA: Resumen, Experiencia, etc */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Resumen Profesional */}
          <Card className="border-border shadow-sm rounded-2xl text-left">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-bold">Resumen Profesional</CardTitle>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full"
                onClick={() => {
                  setSummary(profile.summary);
                  setIsSummaryOpen(true);
                }}
              >
                <Pencil className="h-4 w-4 text-muted-foreground" />
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed italic">
                "{profile.summary}"
              </p>
            </CardContent>
          </Card>

          {/* Experiencia de Trabajo */}
          <Card className="border-border shadow-sm rounded-2xl text-left">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle className="text-lg font-bold">Experiencia Laboral</CardTitle>
                <CardDescription className="text-xs">Tus roles y logros previos.</CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 rounded-xl border-primary/20 text-primary hover:bg-primary/5 font-bold"
                onClick={() => {
                  setTempExp({ id: "", role: "", company: "", period: "", details: "" });
                  setIsExperienceOpen(true);
                }}
              >
                <Plus className="h-4 w-4" /> Agregar
              </Button>
            </CardHeader>
            <CardContent className="space-y-6 pt-4">
              {profile.experience.map((exp) => (
                <div key={exp.id} className="relative pl-6 border-l-2 border-primary/20 group pb-4 last:pb-0">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary/20 border-2 border-background" />
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className="font-bold text-base leading-none">{exp.role}</h4>
                      <p className="text-sm font-medium text-primary">{exp.company}</p>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">{exp.period}</p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => {
                          setTempExp(exp);
                          setIsExperienceOpen(true);
                        }}
                      >
                        <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteExp(exp.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                    {exp.details}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            {/* Educación */}
            <Card className="border-border shadow-sm rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-bold">Educación</CardTitle>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => {
                    setTempEdu({ id: "", degree: "", institution: "", period: "" });
                    setIsEducationOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4 text-primary" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.education.map((edu) => (
                  <div key={edu.id} className="space-y-1 relative group">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold truncate pr-8">{edu.degree}</h4>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute right-0">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6"
                          onClick={() => {
                            setTempEdu(edu);
                            setIsEducationOpen(true);
                          }}
                        >
                          <Pencil className="h-3 w-3 text-muted-foreground" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => deleteEdu(edu.id)}>
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs font-medium text-muted-foreground">{edu.institution}</p>
                    <p className="text-[10px] font-bold text-primary/70">{edu.period}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Idiomas */}
            <Card className="border-border shadow-sm rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-bold">Idiomas</CardTitle>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => {
                    setTempLang({ id: "", name: "", level: "" });
                    setIsLanguageOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4 text-primary" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {profile.languages.map((lang) => (
                  <div key={lang.id} className="flex items-center justify-between group">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span className="text-sm font-bold">{lang.name}</span>
                      <span className="text-[10px] text-muted-foreground font-medium">• {lang.level}</span>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6"
                        onClick={() => {
                          setTempLang(lang);
                          setIsLanguageOpen(true);
                        }}
                      >
                        <Pencil className="h-3 w-3 text-muted-foreground" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => deleteLang(lang.id)}>
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Certificados */}
          <Card className="border-border shadow-sm rounded-2xl text-left">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-bold">Certificados</CardTitle>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => {
                  setTempCerts(profile.certificates.join(", "));
                  setIsCertOpen(true);
                }}
              >
                <Pencil className="h-4 w-4 text-muted-foreground" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {profile.certificates.map((cert, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card group transition-colors hover:border-primary/30">
                    <Award className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-xs font-bold truncate flex-1">{cert}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>
      </div>

      {/* DIÁLOGOS DE EDICIÓN */}

      {/* Diálogo General */}
      <Dialog open={isGeneralOpen} onOpenChange={setIsGeneralOpen}>
        <DialogContent className="rounded-2xl w-[90vw] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Información General</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre completo</Label>
              <Input id="name" value={tempGeneral.name} onChange={(e) => setGeneral({...tempGeneral, name: e.target.value})} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email de contacto</Label>
              <Input id="email" value={tempGeneral.email} onChange={(e) => setGeneral({...tempGeneral, email: e.target.value})} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Ubicación</Label>
              <Input id="location" value={tempGeneral.location} onChange={(e) => setGeneral({...tempGeneral, location: e.target.value})} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input id="phone" value={tempGeneral.phone} onChange={(e) => setGeneral({...tempGeneral, phone: e.target.value})} className="rounded-xl" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="rounded-xl font-bold" onClick={() => setIsGeneralOpen(false)}>Cancelar</Button>
            <Button className="rounded-xl font-bold" onClick={saveGeneral}>Guardar cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo Resumen */}
      <Dialog open={isSummaryOpen} onOpenChange={setIsSummaryOpen}>
        <DialogContent className="rounded-2xl w-[90vw] max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Resumen Profesional</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Textarea 
              value={tempSummary} 
              onChange={(e) => setSummary(e.target.value)} 
              className="min-h-[200px] rounded-xl resize-none"
              placeholder="Escribe un resumen impactante sobre tu trayectoria..."
            />
          </div>
          <DialogFooter>
            <Button variant="outline" className="rounded-xl font-bold" onClick={() => setIsSummaryOpen(false)}>Cancelar</Button>
            <Button className="rounded-xl font-bold" onClick={saveSummary}>Guardar cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo Experiencia */}
      <Dialog open={isExperienceOpen} onOpenChange={setIsExperienceOpen}>
        <DialogContent className="rounded-2xl w-[90vw] max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {tempExp.id ? "Editar Experiencia" : "Agregar Experiencia"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="role">Rol / Cargo</Label>
              <Input id="role" value={tempExp.role} onChange={(e) => setTempExp({...tempExp, role: e.target.value})} className="rounded-xl" placeholder="Ej: Desarrollador Backend" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Compañía</Label>
              <Input id="company" value={tempExp.company} onChange={(e) => setTempExp({...tempExp, company: e.target.value})} className="rounded-xl" placeholder="Ej: CurriAI Corp" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="period">Rango de fechas</Label>
              <Input id="period" value={tempExp.period} onChange={(e) => setTempExp({...tempExp, period: e.target.value})} className="rounded-xl" placeholder="Ej: Junio 2023 - Actualidad" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="details">Detalles y Logros</Label>
              <Textarea 
                id="details" 
                value={tempExp.details} 
                onChange={(e) => setTempExp({...tempExp, details: e.target.value})} 
                className="min-h-[150px] rounded-xl resize-none"
                placeholder="Describe tus tareas y logros principales..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="rounded-xl font-bold" onClick={() => setIsExperienceOpen(false)}>Cancelar</Button>
            <Button className="rounded-xl font-bold" onClick={saveExp}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo Educación */}
      <Dialog open={isEducationOpen} onOpenChange={setIsEducationOpen}>
        <DialogContent className="rounded-2xl w-[90vw] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {tempEdu.id ? "Editar Educación" : "Agregar Educación"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="degree">Título / Grado</Label>
              <Input id="degree" value={tempEdu.degree} onChange={(e) => setTempEdu({...tempEdu, degree: e.target.value})} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inst">Institución</Label>
              <Input id="inst" value={tempEdu.institution} onChange={(e) => setTempEdu({...tempEdu, institution: e.target.value})} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edu-period">Período</Label>
              <Input id="edu-period" value={tempEdu.period} onChange={(e) => setTempEdu({...tempEdu, period: e.target.value})} className="rounded-xl" placeholder="Ej: 2019 - 2023" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="rounded-xl font-bold" onClick={() => setIsEducationOpen(false)}>Cancelar</Button>
            <Button className="rounded-xl font-bold" onClick={saveEdu}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo Social */}
      <Dialog open={isSocialOpen} onOpenChange={setIsSocialOpen}>
        <DialogContent className="rounded-2xl w-[90vw] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Link Social</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="platform">Plataforma</Label>
              <Input id="platform" value={tempSocial.platform} onChange={(e) => setTempSocial({...tempSocial, platform: e.target.value})} className="rounded-xl" placeholder="Ej: LinkedIn, GitHub, X" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">URL / Usuario</Label>
              <Input id="url" value={tempSocial.url} onChange={(e) => setTempSocial({...tempSocial, url: e.target.value})} className="rounded-xl" placeholder="Ej: linkedin.com/in/usuario" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="rounded-xl font-bold" onClick={() => setIsSocialOpen(false)}>Cancelar</Button>
            <Button className="rounded-xl font-bold" onClick={saveSocial}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo Habilidades */}
      <Dialog open={isSkillOpen} onOpenChange={setIsSkillOpen}>
        <DialogContent className="rounded-2xl w-[90vw] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Habilidades</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="skills-list">Lista de habilidades (separadas por coma)</Label>
              <Textarea 
                id="skills-list" 
                value={tempSkills} 
                onChange={(e) => setTempSkills(e.target.value)} 
                className="min-h-[120px] rounded-xl resize-none" 
                placeholder="React, TypeScript, UI Design, etc..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="rounded-xl font-bold" onClick={() => setIsSkillOpen(false)}>Cancelar</Button>
            <Button className="rounded-xl font-bold" onClick={saveSkills}>Guardar cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo Idiomas */}
      <Dialog open={isLanguageOpen} onOpenChange={setIsLanguageOpen}>
        <DialogContent className="rounded-2xl w-[90vw] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Idioma</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="lang-name">Idioma</Label>
              <Input id="lang-name" value={tempLang.name} onChange={(e) => setTempLang({...tempLang, name: e.target.value})} className="rounded-xl" placeholder="Ej: Alemán" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lang-level">Nivel de proficiencia</Label>
              <Input id="lang-level" value={tempLang.level} onChange={(e) => setTempLang({...tempLang, level: e.target.value})} className="rounded-xl" placeholder="Ej: B1 - Intermedio" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="rounded-xl font-bold" onClick={() => setIsLanguageOpen(false)}>Cancelar</Button>
            <Button className="rounded-xl font-bold" onClick={saveLanguages}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo Certificados */}
      <Dialog open={isCertOpen} onOpenChange={setIsCertOpen}>
        <DialogContent className="rounded-2xl w-[90vw] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Certificados</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="certs-list">Lista de certificados (separados por coma)</Label>
              <Textarea 
                id="certs-list" 
                value={tempCerts} 
                onChange={(e) => setTempCerts(e.target.value)} 
                className="min-h-[120px] rounded-xl resize-none" 
                placeholder="Google Cloud, AWS Solutions Architect, etc..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="rounded-xl font-bold" onClick={() => setIsCertOpen(false)}>Cancelar</Button>
            <Button className="rounded-xl font-bold" onClick={saveCerts}>Guardar cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default PersonalInfo;
