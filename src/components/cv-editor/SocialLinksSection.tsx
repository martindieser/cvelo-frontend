import { useState } from "react";
import { Plus, Pencil, Trash2, Globe } from "lucide-react";
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
import { SocialLinkViewModel } from "@/lib/viewmodels";

interface SocialLinksSectionProps {
  items: SocialLinkViewModel[];
  onAdd: (item: SocialLinkViewModel) => void;
  onUpdate: (item: SocialLinkViewModel) => void;
  onDelete: (id: string, name: string) => void;
}

const SocialLinksSection = ({ items, onAdd, onUpdate, onDelete }: SocialLinksSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempItem, setTempItem] = useState<SocialLinkViewModel>({ id: "", platform: "", url: "" });

  const handleOpenAdd = () => {
    setTempItem({ id: "", platform: "", url: "" });
    setIsOpen(true);
  };

  const handleOpenEdit = (item: SocialLinkViewModel) => {
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
      <Card className="border-border shadow-sm rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-bold">Links Sociales</CardTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full"
            onClick={handleOpenAdd}
          >
            <Plus className="h-4 w-4 text-primary" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {items.map((link) => (
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
                  onClick={() => handleOpenEdit(link)}
                >
                  <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => onDelete(link.id, link.platform)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="rounded-2xl w-[90vw] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-left">Link Social</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 text-left">
            <div className="space-y-2">
              <Label htmlFor="platform">Plataforma</Label>
              <Input id="platform" value={tempItem.platform} onChange={(e) => setTempItem({...tempItem, platform: e.target.value})} className="rounded-xl" placeholder="Ej: LinkedIn, GitHub, X" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">URL / Usuario</Label>
              <Input id="url" value={tempItem.url} onChange={(e) => setTempItem({...tempItem, url: e.target.value})} className="rounded-xl" placeholder="Ej: linkedin.com/in/usuario" />
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

export default SocialLinksSection;
