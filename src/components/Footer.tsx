const Footer = () => {
  return (
    <footer className="border-t py-8 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">© 2026 JobOwl</p>
        <div className="flex flex-wrap gap-6 text-sm">
          <a href="#" className="text-foreground hover:underline">Blog</a>
          <a href="#" className="text-foreground hover:underline">Affiliate Program</a>
          <a href="#" className="text-foreground hover:underline">Terms & Conditions</a>
          <a href="#" className="text-foreground hover:underline">Privacy Policy</a>
          <a href="#" className="text-foreground hover:underline">Contact</a>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Resources</p>
          <a href="#" className="text-sm hover:underline">Resume Summary Examples</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
