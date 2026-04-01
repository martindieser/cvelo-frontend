import { useState } from "react";
import { Plus, Pencil, Trash2, Link as LinkIcon } from "lucide-react";
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
import { ProjectViewModel } from "@/lib/viewmodels";

interface ProjectsSectionProps {
  items: ProjectViewModel[];
  onAdd: (item: ProjectViewModel) => void;
  onUpdate: (item: ProjectViewModel) => void;
  onDelete: (id: string, name: string) => void;
}

const ProjectsSection = ({ items, onAdd, onUpdate, onDelete }: ProjectsSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempItem, setTempItem] = useState<ProjectViewModel>({ id: "", title: "", details: "", technologies: [], link: "", period: "" });

  const handleOpenAdd = () => {
    setTempItem({ id: "", title: "", details: "", technologies: [], link: "", period: "" });
    setIsOpen(true);
  };

  const handleOpenEdit = (item: ProjectViewModel) => {
    setTempItem(item);
    setIsOpen(true);
  };

  const handleSave = () => {
    if (tempItem.id) {
      onUpdate(tempItem);
    } else {
      onAdd({ ...tempItem, id: Math.random().toString() });
    }
    setIsOpen(false);
  };

  return (
    <>
      <Card className="border-border shadow-sm rounded-2xl text-left">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle className="text-lg font-bold">Proyectos</CardTitle>
            <CardDescription className="text-xs">Proyectos personales o destacados.</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 rounded-xl border-primary/20 text-primary hover:bg-primary/5 font-bold"
            onClick={handleOpenAdd}
          >
            <Plus className="h-4 w-4" /> Agregar
          </Button>
        </CardHeader>
        <CardContent className="space-y-6 pt-4">
          {items.map((proj) => (
            <div key={proj.id} className="relative pl-6 border-l-2 border-primary/20 group pb-4 last:pb-0">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary/20 border-2 border-background" />
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h4 className="font-bold text-base leading-none">{proj.title}</h4>
                  {proj.period && <p className="text-[10px] font-bold text-muted-foreground uppercase">{proj.period}</p>}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => handleOpenEdit(proj)}
                  >
                    <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => onDelete(proj.id, proj.title)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <div className="mt-2 text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {proj.details}
              </div>
              {proj.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {proj.technologies.map((tech, i) => (
                    <Badge key={i} variant="outline" className="text-[9px] px-2 py-0 h-5">
                      {tech}
                    </Badge>
                  ))}
                </div>
              )}
              {proj.link && (
                <a href={proj.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-primary font-bold mt-2 hover:underline">
                  <LinkIcon className="h-3 w-3" /> Ver proyecto
                </a>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="rounded-2xl w-[90vw] max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-left">
              {tempItem.id ? "Editar Proyecto" : "Agregar Proyecto"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 text-left">
            <div className="space-y-2">
              <Label htmlFor="proj-title">Título del Proyecto</Label>
              <Input id="proj-title" value={tempItem.title} onChange={(e) => setTempItem({...tempItem, title: e.target.value})} className="rounded-xl" placeholder="Ej: E-commerce con Next.js" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="proj-period">Período (Opcional)</Label>
              <Input id="proj-period" value={tempItem.period} onChange={(e) => setTempItem({...tempItem, period: e.target.value})} className="rounded-xl" placeholder="Ej: 2023" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="proj-link">URL del Proyecto / Repositorio</Label>
              <Input id="proj-link" value={tempItem.link} onChange={(e) => setTempItem({...tempItem, link: e.target.value})} className="rounded-xl" placeholder="Ej: github.com/usuario/proyecto" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="proj-techs">Tecnologías (separadas por coma)</Label>
              <Input 
                id="proj-techs" 
                value={tempItem.technologies.join(", ")} 
                onChange={(e) => setTempItem({...tempItem, technologies: e.target.value.split(",").map(t => t.trim()).filter(t => t !== "")})} 
                className="rounded-xl" 
                placeholder="Ej: React, Node.js, PostgreSQL" 
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="proj-details">Descripción del Proyecto</Label>
              <Textarea 
                id="proj-details" 
                value={tempItem.details} 
                onChange={(e) => setTempItem({...tempItem, details: e.target.value})} 
                className="min-h-[120px] rounded-xl resize-none"
                placeholder="Describe qué hiciste y qué tecnologías usaste..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="rounded-xl font-bold" onClick={() => setIsOpen(false)}>Cancelar</Button>
            <Button className="rounded-xl font-bold" onClick={handleSave}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProjectsSection;
