import { ArrowRight, FileText, Target, Search, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: FileText,
    title: "Plantillas de CV optimizadas",
    description: "Nuestras plantillas son fácilmente legibles por los sistemas ATS, asegurando que tu CV pase el primer filtro.",
  },
  {
    icon: Target,
    title: "Perfil ideal para el puesto",
    description: "Reenfocamos tu experiencia y habilidades para que las prioridades del puesto resalten al instante ante los reclutadores.",
  },
  {
    icon: Search,
    title: "Inyección de palabras clave",
    description: "Extraemos las palabras clave más importantes de la oferta y las añadimos de forma natural a tu currículum.",
  },
  {
    icon: TrendingUp,
    title: "Mayor tasa de entrevistas",
    description: "Nuestros usuarios reportan un aumento significativo en las invitaciones a entrevistas tras usar CurriAI.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Deja de reescribir tu CV para cada oferta</h2>
        <p className="text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
          Genera un currículum específico en segundos, basado en tu experiencia y habilidades reales.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {features.map((feature) => (
            <div key={feature.title} className="bg-muted/30 border border-border rounded-xl p-6 text-left">
              <feature.icon className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
        <Button size="lg" className="rounded-full px-8 py-6 text-lg font-semibold gap-2">
          ¡Adaptar mi CV ahora! <ArrowRight className="w-5 h-5" />
        </Button>
        {/* <p className="mt-3 text-sm text-muted-foreground">Empieza gratis · Sin tarjeta de crédito</p> */}
      </div>
    </section>
  );
};

export default FeaturesSection;
