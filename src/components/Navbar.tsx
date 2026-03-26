import CTAButton from "./CTAButton";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-lg border-2 border-primary flex items-center justify-center bg-accent/20">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
            <path d="M12 20V10" />
            <path d="M18 20V4" />
            <path d="M6 20v-4" />
          </svg>
        </div>
        <span className="font-bold text-lg">CurriAI</span>
      </div>
      <CTAButton variant="outline" className="rounded-full px-6 border-border hover:bg-muted">
        Iniciar sesión
      </CTAButton>
    </nav>
  );
};

export default Navbar;
