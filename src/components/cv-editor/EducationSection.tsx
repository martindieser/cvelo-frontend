import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EducationViewModel } from "@/lib/viewmodels";

interface EducationSectionProps {
  items: EducationViewModel[];
  onAdd: (item: EducationViewModel) => void;
  onUpdate: (item: EducationViewModel) => void;
  onDelete: (id: string, name: string) => void;
}

const EducationSection = ({ items, onAdd, onUpdate, onDelete }: EducationSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempItem, setTempItem] = useState<EducationViewModel>({ id: "", degree: "", institution: "", period: "" });

  const handleOpenAdd = () => {
    setTempItem({ id: "", degree: "", institution: "", period: "" });
    setIsOpen(true);
  };

  const handleOpenEdit = (item: EducationViewModel) => {
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
          <CardTitle className="text-lg font-bold">Educación</CardTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={handleOpenAdd}
          >
            <Plus className="h-4 w-4 text-primary" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((edu) => (
            <div key={edu.id} className="space-y-1 relative group">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold truncate pr-8">{edu.degree}</h4>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute right-0">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6"
                    onClick={() => handleOpenEdit(edu)}
                  >
                    <Pencil className="h-3 w-3 text-muted-foreground" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onDelete(edu.id, edu.degree)}>
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

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="rounded-2xl w-[90vw] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-left">
              {tempItem.id ? "Editar Educación" : "Agregar Educación"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 text-left">
            <div className="space-y-2">
              <Label htmlFor="degree">Título / Grado</Label>
              <Input id="degree" value={tempItem.degree} onChange={(e) => setTempItem({...tempItem, degree: e.target.value})} className="rounded-xl" placeholder="Ej: Licenciatura en Sistemas" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inst">Institución</Label>
              <Input id="inst" value={tempItem.institution} onChange={(e) => setTempItem({...tempItem, institution: e.target.value})} className="rounded-xl" placeholder="Ej: Universidad de Buenos Aires" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edu-period">Período</Label>
              <Input id="edu-period" value={tempItem.period} onChange={(e) => setTempItem({...tempItem, period: e.target.value})} className="rounded-xl" placeholder="Ej: 2019 - 2023" />
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

export default EducationSection;
