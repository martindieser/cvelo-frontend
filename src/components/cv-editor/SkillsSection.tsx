import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface SkillsSectionProps {
  items: string[];
  onSave: (items: string[]) => void;
}

const SkillsSection = ({ items, onSave }: SkillsSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempSkills, setTempSkills] = useState("");

  const handleOpen = () => {
    setTempSkills(items.join(", "));
    setIsOpen(true);
  };

  const handleSave = () => {
    const skillList = tempSkills.split(",").map(s => s.trim()).filter(s => s !== "");
    onSave(skillList);
    setIsOpen(false);
  };

  return (
    <>
      <Card className="border-border shadow-sm rounded-2xl text-left">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-bold">Habilidades</CardTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full"
            onClick={handleOpen}
          >
            <Pencil className="h-4 w-4 text-muted-foreground" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {items.length > 0 ? items.map((skill, index) => (
              <Badge key={index} className="bg-primary/10 text-primary border-none font-bold px-3 py-1 rounded-full text-[10px]">
                {skill}
              </Badge>
            )) : (
              <p className="text-xs text-muted-foreground italic">No se han añadido habilidades.</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="rounded-2xl w-[90vw] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-left">Habilidades</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 text-left">
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
            <Button variant="outline" className="rounded-xl font-bold" onClick={() => setIsOpen(false)}>Cancelar</Button>
            <Button className="rounded-xl font-bold" onClick={handleSave}>Guardar cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SkillsSection;
