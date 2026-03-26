import { Plus, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useUserProfile } from "@/hooks/useUserProfile";

interface HeaderProps {
  onAvatarClick: () => void;
  activeTab: string;
  isTailored: boolean;
  onNewAdapt: () => void;
}

const DashboardHeader = ({ onAvatarClick, activeTab, isTailored, onNewAdapt }: HeaderProps) => {
  const { profile, loading } = useUserProfile();
  const showAdaptButton = activeTab !== "tailor" || isTailored;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 lg:px-8 shrink-0 relative z-40">
      <div className="flex items-center gap-2 lg:gap-4">
        {loading ? (
          <div className="h-8 w-24 bg-muted animate-pulse rounded-full" />
        ) : (
          <Badge variant="secondary" className="bg-primary/10 text-primary border-none font-bold px-3 lg:px-4 py-1.5 rounded-full text-[10px] lg:text-sm whitespace-nowrap">
            Créditos: {profile?.credits ?? 0}
          </Badge>
        )}
      </div>
      
      <div className="flex items-center gap-2 lg:gap-3">
        {showAdaptButton && (
          <Button 
            size="sm" 
            onClick={onNewAdapt}
            className="gap-2 rounded-full px-3 lg:px-5 font-bold h-9 lg:h-10 text-xs lg:text-sm animate-in fade-in zoom-in-95 duration-200"
          >
            <Plus className="w-3.5 h-3.5 lg:w-4 h-4" /> 
            <span className="hidden sm:inline">Adaptar nuevo CV</span>
            <span className="sm:hidden">Nuevo</span>
          </Button>
        )}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm border border-primary/20 cursor-pointer hover:bg-primary/30 transition-colors outline-none shrink-0 overflow-hidden">
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : profile?.avatar ? (
                <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                getInitials(profile?.name ?? "U")
              )}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-xl p-2 mt-2">
            <DropdownMenuItem 
              className="rounded-lg gap-2 cursor-pointer py-2.5"
              onClick={onAvatarClick}
            >
              <User className="w-4 h-4" />
              <span>Elegir una foto</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default DashboardHeader;
