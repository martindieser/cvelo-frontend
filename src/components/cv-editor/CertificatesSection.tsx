import { useState } from "react";
import { Pencil, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CertificatesSectionProps {
  items: string[];
  onSave: (items: string[]) => void;
}

const CertificatesSection = ({ items, onSave }: CertificatesSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempCerts, setTempCerts] = useState("");

  const handleOpen = () => {
    setTempCerts(items.join(", "));
    setIsOpen(true);
  };

  const handleSave = () => {
    const certList = tempCerts.split(",").map(c => c.trim()).filter(c => c !== "");
    onSave(certList);
    setIsOpen(false);
  };

  return (
    <>
      <Card className="border-border shadow-sm rounded-2xl text-left">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-bold">Certificados</CardTitle>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {items.length > 0 ? items.map((cert, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card group transition-colors hover:border-primary/30">
                <Award className="h-4 w-4 text-primary shrink-0" />
                <span className="text-xs font-bold truncate flex-1">{cert}</span>
              </div>
            )) : (
              <p className="text-xs text-muted-foreground italic col-span-2">No se han añadido certificados.</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="rounded-2xl w-[90vw] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-left">Certificados</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 text-left">
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
            <Button variant="outline" className="rounded-xl font-bold" onClick={() => setIsOpen(false)}>Cancelar</Button>
            <Button className="rounded-xl font-bold" onClick={handleSave}>Guardar cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CertificatesSection;
