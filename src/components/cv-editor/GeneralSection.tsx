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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface GeneralInfo {
  name: string;
  email: string;
  location: string;
  phone: string;
}

interface GeneralSectionProps {
  data: GeneralInfo;
  onSave: (data: GeneralInfo) => void;
  isGuest?: boolean;
}

const GeneralSection = ({ data, onSave, isGuest = false }: GeneralSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempData, setTempData] = useState<GeneralInfo>(data);

  const handleOpen = () => {
    setTempData(data);
    setIsOpen(true);
  };

  const handleSave = () => {
    onSave(tempData);
    setIsOpen(false);
  };

  return (
    <>
      <Card className="border-border shadow-sm rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-bold">General</CardTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full"
            onClick={handleOpen}
          >
            <Pencil className="h-4 w-4 text-muted-foreground" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1 text-left">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Nombre completo</p>
            <p className="text-sm font-medium">{data.name || "—"}</p>
          </div>
          <div className="space-y-1 text-left">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Email</p>
            <p className="text-sm font-medium">{data.email || "—"}</p>
          </div>
          <div className="space-y-1 text-left">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Ubicación</p>
            <p className="text-sm font-medium">{data.location || "—"}</p>
          </div>
          <div className="space-y-1 text-left">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Teléfono</p>
            <p className="text-sm font-medium">{data.phone || "—"}</p>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="rounded-2xl w-[90vw] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-left">Información General</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 text-left">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre completo</Label>
              <Input 
                id="name" 
                value={tempData.name} 
                onChange={(e) => setTempData({...tempData, name: e.target.value})} 
                className="rounded-xl" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email de contacto</Label>
              <Input 
                id="email" 
                value={tempData.email} 
                onChange={(e) => isGuest && setTempData({...tempData, email: e.target.value})}
                disabled={!isGuest} 
                readOnly={!isGuest} 
                className={`rounded-xl ${!isGuest ? "bg-muted/50 cursor-not-allowed" : ""}`} 
              />
              {!isGuest && (
                <p className="text-[10px] text-muted-foreground italic">El email está vinculado a tu cuenta y no puede modificarse.</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Ubicación</Label>
              <Input 
                id="location" 
                value={tempData.location} 
                onChange={(e) => setTempData({...tempData, location: e.target.value})} 
                className="rounded-xl" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input 
                id="phone" 
                value={tempData.phone} 
                onChange={(e) => setTempData({...tempData, phone: e.target.value})} 
                className="rounded-xl" 
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

export default GeneralSection;
