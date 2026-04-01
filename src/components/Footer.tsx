import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t py-12 px-4 bg-white font-body">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex flex-col items-center md:items-start gap-2">
          <p className="text-lg font-black tracking-tighter">CVealo</p>
          <p className="text-sm text-muted-foreground">© 2026 CVealo. Todos los derechos reservados.</p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-8 text-sm font-medium">
          <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">
            Términos y Condiciones
          </Link>
          <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
            Privacidad
          </Link>
          <a href="mailto:soporte@CVealo.com" className="text-muted-foreground hover:text-primary transition-colors">
            Contacto
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
