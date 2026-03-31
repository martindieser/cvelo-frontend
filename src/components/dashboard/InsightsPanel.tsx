import { Search, Sparkles, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AppliedChangeViewModel } from "@/lib/viewmodels";

interface InsightsContentProps {
  keywords: string[];
  changes: AppliedChangeViewModel[];
  activeHighlight?: string | null;
  onHighlightClick?: (kw: string | null) => void;
}

export const InsightsContent = ({ 
  keywords, 
  changes, 
  activeHighlight, 
  onHighlightClick 
}: InsightsContentProps) => (
  <div className="space-y-6 pb-20 lg:pb-0 font-body">
    <div className="space-y-3">
      <div className="flex items-center gap-2 px-1">
        <Search className="w-4 h-4 text-primary" />
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Palabras clave detectadas</span>
      </div>
      <div className="bg-card border border-border rounded-2xl p-4 flex flex-wrap gap-2 shadow-sm">
        {keywords.map((kw, i) => (
          <Badge 
            key={i} 
            className={`cursor-pointer transition-all px-3 py-1 rounded-full font-bold border-none ${
              activeHighlight === kw 
                ? "bg-primary text-primary-foreground scale-105 shadow-md" 
                : "bg-primary/10 text-primary hover:bg-primary/20"
            }`}
            onClick={() => onHighlightClick?.(activeHighlight === kw ? null : kw)}
          >
            {kw}
          </Badge>
        ))}
        {/*<Badge className="bg-muted text-muted-foreground border-none px-3 py-1 rounded-full font-bold italic opacity-50">+ Agregar</Badge>*/}
      </div>
    </div>

    <div className="space-y-3">
      <div className="flex items-center gap-2 px-1">
        <Sparkles className="w-4 h-4 text-primary" />
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Cambios aplicados</span>
      </div>
      <div className="space-y-3">
        {changes.map((change, i) => (
          <Card key={i} className="border-border shadow-sm rounded-2xl overflow-hidden bg-card">
            <div className="p-4 bg-muted/20 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm">
                <MessageSquare className="w-4 h-4 text-primary" />
                {change.section}
              </div>
            </div>
            <CardContent className="p-4 space-y-3">
              <ul className="space-y-2 pl-3 border-l-2 border-primary/30">
                {change.description.map((item, j) => (
                  <li key={j} className="text-xs text-muted-foreground leading-relaxed flex gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              {/* 
              <div className="flex items-center gap-3 pt-2">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">¿Te sirvió?</span>
                <div className="flex gap-2">
                  <button className="p-1.5 rounded-lg border border-border hover:border-primary/50 text-muted-foreground hover:text-primary transition-all">👍</button>
                  <button className="p-1.5 rounded-lg border border-border hover:border-destructive/50 text-muted-foreground hover:text-destructive transition-all">👎</button>
                </div>
              </div>
              */}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </div>
);

interface InsightsPanelProps {
  keywords: string[];
  changes: AppliedChangeViewModel[];
  activeHighlight?: string | null;
  onHighlightClick?: (kw: string | null) => void;
}

const InsightsPanel = ({ keywords, changes, activeHighlight, onHighlightClick }: InsightsPanelProps) => {
  return (
    <aside className="hidden xl:block w-80 shrink-0 sticky top-8 h-fit text-left">
      <InsightsContent 
        keywords={keywords} 
        changes={changes} 
        activeHighlight={activeHighlight}
        onHighlightClick={onHighlightClick}
      />
    </aside>
  );
};

export default InsightsPanel;
