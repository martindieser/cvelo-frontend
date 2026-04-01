import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface SummarySectionProps {
  value: string;
  onSave: (value: string) => void;
}

const SummarySection = ({ value, onSave }: SummarySectionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempSummary, setTempSummary] = useState(value);

  const handleOpen = () => {
    setTempSummary(value);
    setIsOpen(true);
  };

  const handleSave = () => {
    onSave(tempSummary);
    setIsOpen(false);
  };

  return (
    <>
      <Card className="border-border shadow-sm rounded-2xl text-left">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-bold">Resumen Profesional</CardTitle>
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
          <p className="text-sm text-muted-foreground leading-relaxed italic">
            {value ? `"${value}"` : "No se ha añadido un resumen profesional."}
          </p>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="rounded-2xl w-[90vw] max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-left">Resumen Profesional</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Textarea 
              value={tempSummary} 
              onChange={(e) => setTempSummary(e.target.value)} 
              className="min-h-[200px] rounded-xl resize-none"
              placeholder="Escribe un resumen impactante sobre tu trayectoria..."
            />
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

export default SummarySection;
