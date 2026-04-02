import CTAButton from "./CTAButton";
import { Link } from "react-router-dom";
import logoMascot from "@/assets/logo-mascot.svg";
import { useAuth } from "@/hooks/useAuth";

interface NavbarProps {
  hideAuth?: boolean;
}

const Navbar = ({ hideAuth = false }: NavbarProps) => {
  const { isAuthenticated } = useAuth();

  return (
    <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
      <Link to="/" className="flex items-center group">
        <div className="w-24 h-24 flex items-center justify-center transition-transform group-hover:scale-110">
          <img src={logoMascot} alt="CVealo Logo" className="w-full h-full object-contain" />
        </div>
      </Link>
      <div className="flex items-center gap-4">
        {!isAuthenticated && (
          <Link to="/free-builder" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors hidden sm:block">
            Editor Gratuito
          </Link>
        )}
        {!hideAuth && (
          <CTAButton to={isAuthenticated ? "/dashboard" : "/login"} variant="outline" className="rounded-full px-6 border-border hover:bg-muted">
            {isAuthenticated ? "Mi Dashboard" : "Iniciar sesión"}
          </CTAButton>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
