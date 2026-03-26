import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-lg border-2 border-foreground flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20V10" />
            <path d="M18 20V4" />
            <path d="M6 20v-4" />
          </svg>
        </div>
        <span className="font-bold text-lg">JobOwl</span>
      </div>
      <Button variant="outline" className="rounded-full px-6 border-foreground">
        Log in
      </Button>
    </nav>
  );
};

export default Navbar;
