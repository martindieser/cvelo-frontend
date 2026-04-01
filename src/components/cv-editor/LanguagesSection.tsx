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
import { LanguageViewModel } from "@/lib/viewmodels";

interface LanguagesSectionProps {
  items: LanguageViewModel[];
  onAdd: (item: LanguageViewModel) => void;
  onUpdate: (item: LanguageViewModel) => void;
  onDelete: (id: string, name: string) => void;
}

const LanguagesSection = ({ items, onAdd, onUpdate, onDelete }: LanguagesSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempItem, setTempItem] = useState<LanguageViewModel>({ id: "", name: "", level: "" });

  const handleOpenAdd = () => {
    setTempItem({ id: "", name: "", level: "" });
    setIsOpen(true);
  };

  const handleOpenEdit = (item: LanguageViewModel) => {
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
          <CardTitle className="text-lg font-bold">Idiomas</CardTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={handleOpenAdd}
          >
            <Plus className="h-4 w-4 text-primary" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {items.map((lang) => (
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
                  onClick={() => handleOpenEdit(lang)}
                >
                  <Pencil className="h-3 w-3 text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onDelete(lang.id, lang.name)}>
                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="rounded-2xl w-[90vw] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-left">
              {tempItem.id ? "Editar Idioma" : "Agregar Idioma"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 text-left">
            <div className="space-y-2">
              <Label htmlFor="lang-name">Idioma</Label>
              <Input id="lang-name" value={tempItem.name} onChange={(e) => setTempItem({...tempItem, name: e.target.value})} className="rounded-xl" placeholder="Ej: Alemán" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lang-level">Nivel de proficiencia</Label>
              <Input id="lang-level" value={tempItem.level} onChange={(e) => setTempItem({...tempItem, level: e.target.value})} className="rounded-xl" placeholder="Ej: B1 - Intermedio" />
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

export default LanguagesSection;
