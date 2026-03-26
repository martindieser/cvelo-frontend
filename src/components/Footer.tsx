const Footer = () => {
  return (
    <footer className="border-t py-8 px-4 bg-white">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">© 2026 CurriAI</p>
        <div className="flex flex-wrap gap-6 text-sm">
          <a href="#" className="text-foreground hover:underline">Blog</a>
          <a href="#" className="text-foreground hover:underline">Programa de Afiliados</a>
          <a href="#" className="text-foreground hover:underline">Términos y Condiciones</a>
          <a href="#" className="text-foreground hover:underline">Privacidad</a>
          <a href="#" className="text-foreground hover:underline">Contacto</a>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Recursos</p>
          <a href="#" className="text-sm hover:underline">Ejemplos de Resumen de CV</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
