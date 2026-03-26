import CTAButton from "./CTAButton";
import { Link } from "react-router-dom";
import logoMascot from "@/assets/logo-mascot.svg";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
      <Link to="/" className="flex items-center group">
        <div className="w-24 h-24 flex items-center justify-center transition-transform group-hover:scale-110">
          <img src={logoMascot} alt="CurriAI Logo" className="w-full h-full object-contain" />
        </div>
      </Link>
      <CTAButton to="/login" variant="outline" className="rounded-full px-6 border-border hover:bg-muted">
        Iniciar sesión
      </CTAButton>
    </nav>
  );
};

export default Navbar;
