import { ArrowRight } from "lucide-react";
import CTAButton from "./CTAButton";
import tailoringMachine from "@/assets/tailoring-machine.png";

const jobCards = [
  { icon: "in", title: "Social Media Manager", company: "EmpresaIncreíble" },
  { icon: "i", title: "Consultor PR", company: "EmpresaIncreíble" },
  { icon: "g", title: "Especialista en Marketing", company: "EmpresaGenial" },
];

const resumeCards = [
  { name: "Juan Pérez", location: "Madrid, España", email: "juan.perez@mail.me", summary: "Candidato ideal para Especialista en Marketing" },
  { name: "Juan Pérez", location: "Madrid, España", email: "juan.perez@mail.me", summary: "Candidato top para Social Media Manager" },
  { name: "Juan Pérez", location: "Madrid, España", email: "juan.perez@mail.me", summary: "Increíble candidato para Consultor PR" },
];

const HeroSection = () => {
  return (
    <section className="text-center pt-8 pb-0 overflow-hidden bg-background">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-5xl md:text-6xl lg:text-7xl leading-tight mb-6">
          <span className="font-display italic inline-block bg-accent px-6 py-2 rounded-xl -rotate-1 mb-2">
            Adapta tu <span className="font-bold not-italic font-body">Currículum</span>
          </span>
          <br />
          <span className="font-light">a cualquier </span>
          <span className="font-bold">Oferta de Trabajo</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Pega la descripción de un trabajo y obtén una versión de tu CV adaptada exactamente a lo que ese puesto requiere.
        </p>
        <CTAButton size="lg" className="rounded-full px-8 py-6 text-lg font-semibold gap-2 bg-primary hover:bg-primary/90">
          ¡Adaptar mi CV ahora! <ArrowRight className="w-5 h-5" />
        </CTAButton>
        {/* <p className="mt-4 text-sm text-muted-foreground">
          Más de 55,000 CVs adaptados · 4.94/5 ⭐ (394{" "}
          <a href="#" className="underline">reseñas</a>)
        </p> */}
      </div>

      {/* Job cards marquee */}
      <div className="bg-white py-3 mt-12 relative z-30 overflow-hidden border-y border-border">
        <div className="flex animate-marquee">
          {[...jobCards, ...jobCards, ...jobCards, ...jobCards].map((card, i) => (
            <div key={i} className="flex items-center gap-3 bg-card border border-border rounded-lg px-4 py-2 mx-3 min-w-[220px] shadow-sm">
              <div className="w-8 h-8 bg-accent/20 text-accent-foreground rounded-md flex items-center justify-center text-xs font-bold">
                {card.icon}
              </div>
              <div className="text-left">
                <div className="font-semibold text-sm">{card.title}</div>
                <div className="text-xs text-muted-foreground">en {card.company}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;