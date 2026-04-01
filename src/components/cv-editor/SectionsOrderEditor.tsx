import { GripVertical, Eye, EyeOff, LayoutList } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Reorder } from "framer-motion";
import { cn } from "@/lib/utils";
import { SectionViewModel } from "@/lib/viewmodels";

interface SectionsOrderEditorProps {
  sections: SectionViewModel[];
  onReorder: (sections: SectionViewModel[]) => void;
  onToggleVisibility: (id: string) => void;
}

const SectionsOrderEditor = ({ sections, onReorder, onToggleVisibility }: SectionsOrderEditorProps) => {
  return (
    <Card className="border-border shadow-sm rounded-2xl">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2 text-left">
          <LayoutList className="w-5 h-5 text-primary" /> Estructura del CV
        </CardTitle>
        <CardDescription className="text-left text-xs">
          Arrastra para reordenar y usa el ojo para ocultar secciones en el PDF final.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="max-w-full overflow-hidden">
          <Reorder.Group axis="y" values={sections} onReorder={onReorder} className="space-y-2">
            {sections.map((section) => (
              <Reorder.Item 
                key={section.id} 
                value={section}
                className={cn(
                  "bg-card border border-border rounded-xl p-3 flex items-center justify-between cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-all",
                  !section.visible && "opacity-50 grayscale"
                )}
              >
                <div className="flex items-center gap-3">
                  <GripVertical className="w-4 h-4 text-muted-foreground" />
                  <span className="font-bold text-sm text-foreground">{section.name}</span>
                </div>
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleVisibility(section.id);
                  }}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  {section.visible ? (
                    <Eye className="w-4 h-4 text-primary" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>
      </CardContent>
    </Card>
  );
};

export default SectionsOrderEditor;
