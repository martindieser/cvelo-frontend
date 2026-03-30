import { useState } from "react";
import { 
  LayoutDashboard, 
  User, 
  FileText, 
  Settings, 
  LogOut, 
  Sparkles,
  Menu
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import logoMascot from "@/assets/logo-mascot.svg";

import { useAuth } from "@/hooks/useAuth";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onPricingClick?: () => void;
  onItemClick?: () => void;
}

export const SidebarContent = ({ activeTab, setActiveTab, onPricingClick, onItemClick }: SidebarProps) => {
  const { logout } = useAuth();

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    if (onItemClick) onItemClick();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 flex justify-center">
        <Link 
          to="/dashboard" 
          className="group"
          onClick={() => {
            handleTabClick("tailor");
          }}
        >
          <div className="w-24 h-24 transition-transform group-hover:scale-110">
            <img src={logoMascot} alt="Logo" className="w-full h-full object-contain" />
          </div>
        </Link>
      </div>

      <div className="px-4 mb-4">
        <Button 
          onClick={() => {
            if (onPricingClick) onPricingClick();
            if (onItemClick) onItemClick();
          }}
          className="w-full justify-start gap-2 bg-primary/90 hover:bg-primary text-primary-foreground font-bold rounded-xl py-6 shadow-md shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Sparkles className="w-4 h-4" />
          <span>Comprar créditos</span>
        </Button>
      </div>

      <nav className="flex-1 px-2 space-y-1">
        <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Principal
        </div>
        <button 
          onClick={() => handleTabClick("tailor")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === "tailor" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"}`}
        >
          <LayoutDashboard className="w-4 h-4" />
          Adaptar CV
        </button>
        <button 
          onClick={() => handleTabClick("info")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === "info" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"}`}
        >
          <User className="w-4 h-4" />
          Información Personal
        </button>
        <button 
          onClick={() => handleTabClick("docs")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === "docs" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"}`}
        >
          <FileText className="w-4 h-4" />
          Mis Documentos
        </button>

        <div className="px-4 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Sistema
        </div>
        <button 
        onClick={() => handleTabClick("settings")}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === "settings" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"}`}
        >
        <Settings className="w-4 h-4" />
        Configuración
        </button>
        <button 
          onClick={() => {
            logout();
            if (onItemClick) onItemClick();
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Cerrar sesión
        </button>
      </nav>

      <div className="p-4 border-t border-border mt-auto">
        <div className="bg-muted/50 rounded-xl p-4 text-center">
          <p className="text-xs text-muted-foreground mb-2">¿Necesitas ayuda?</p>
          <a href="mailto:hola@curriai.co" className="text-xs font-bold text-primary hover:underline">hola@curriai.co</a>
        </div>
      </div>
    </div>
  );
};

const DashboardSidebar = ({ activeTab, setActiveTab, onPricingClick }: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-card border-r border-border flex-col shrink-0 h-full">
        <SidebarContent activeTab={activeTab} setActiveTab={setActiveTab} onPricingClick={onPricingClick} />
      </aside>

      {/* Mobile Menu Button (Floating or Integrated) */}
      <div className="lg:hidden fixed bottom-6 left-6 z-50">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button size="icon" className="w-14 h-14 rounded-full shadow-lg shadow-primary/40">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72 border-r-border">
            <SidebarContent 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              onPricingClick={onPricingClick} 
              onItemClick={() => setIsOpen(false)}
            />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default DashboardSidebar;
