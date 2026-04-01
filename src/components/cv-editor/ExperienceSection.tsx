import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { WorkExperienceViewModel } from "@/lib/viewmodels";

interface ExperienceSectionProps {
  items: WorkExperienceViewModel[];
  onAdd: (item: WorkExperienceViewModel) => void;
  onUpdate: (item: WorkExperienceViewModel) => void;
  onDelete: (id: string, name: string) => void;
}

const ExperienceSection = ({ items, onAdd, onUpdate, onDelete }: ExperienceSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempItem, setTempItem] = useState<WorkExperienceViewModel>({ id: "", role: "", company: "", period: "", details: "" });

  const handleOpenAdd = () => {
    setTempItem({ id: "", role: "", company: "", period: "", details: "" });
    setIsOpen(true);
  };

  const handleOpenEdit = (item: WorkExperienceViewModel) => {
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
            <CardTitle className="text-lg font-bold">Experiencia Laboral</CardTitle>
            <CardDescription className="text-xs">Tus roles y logros previos.</CardDescription>
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
          {items.map((exp) => (
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
                    onClick={() => handleOpenEdit(exp)}
                  >
                    <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => onDelete(exp.id, exp.role)}>
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

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="rounded-2xl w-[90vw] max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-left">
              {tempItem.id ? "Editar Experiencia" : "Agregar Experiencia"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 text-left">
            <div className="space-y-2">
              <Label htmlFor="role">Rol / Cargo</Label>
              <Input id="role" value={tempItem.role} onChange={(e) => setTempItem({...tempItem, role: e.target.value})} className="rounded-xl" placeholder="Ej: Desarrollador Backend" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Compañía</Label>
              <Input id="company" value={tempItem.company} onChange={(e) => setTempItem({...tempItem, company: e.target.value})} className="rounded-xl" placeholder="Ej: CVealo Corp" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="period">Rango de fechas</Label>
              <Input id="period" value={tempItem.period} onChange={(e) => setTempItem({...tempItem, period: e.target.value})} className="rounded-xl" placeholder="Ej: Junio 2023 - Actualidad" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="details">Detalles y Logros</Label>
              <Textarea 
                id="details" 
                value={tempItem.details} 
                onChange={(e) => setTempItem({...tempItem, details: e.target.value})} 
                className="min-h-[150px] rounded-xl resize-none"
                placeholder="Describe tus tareas y logros principales..."
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

export default ExperienceSection;
