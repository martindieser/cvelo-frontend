import { CheckCircle } from "lucide-react";
import CTAButton from "./CTAButton";

const PricingSection = () => {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Precios Simples y Transparentes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Starter */}
          <div className="bg-card border-2 border-border rounded-2xl p-8 shadow-sm">
            <h3 className="text-xl font-bold text-center mb-1">Plan Inicial</h3>
            <p className="text-4xl font-bold text-center mb-1">Gratis</p>
            <p className="text-sm text-muted-foreground text-center mb-8">(¡sin tarjeta de crédito!)</p>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-accent" />
              <span className="text-sm">Genera 3 CVs adaptados gratis</span>
            </div>
          </div>

          {/* Pro */}
          <div className="bg-card border-2 border-primary rounded-2xl p-8 shadow-md relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full">
              RECOMENDADO
            </div>
            <h3 className="text-xl font-bold text-center mb-1">CurriAI Pro</h3>
            <p className="text-center mb-6">
              <span className="text-4xl font-bold">24,99€</span>
              <span className="text-muted-foreground">/mes</span>
            </p>
            <div className="space-y-3 mb-6">
              {[
                "Generación ilimitada de CVs adaptados",
                "Cartas de presentación ilimitadas",
                "CVs con tono personalizado",
                "Soporte prioritario",
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
            <div className="bg-warning/20 rounded-xl p-4 border border-warning">
              <p className="font-bold text-sm">¡Más entrevistas o te devolvemos el dinero!</p>
              <p className="text-xs text-foreground/70 mt-1">
                Si no consigues más entrevistas tras usar CurriAI, puedes solicitar un reembolso.{" "}
                <a href="#" className="underline font-medium">Ver reglas</a>.
              </p>
            </div>
          </div>
        </div>
        <div className="text-center mt-10">
          <CTAButton size="lg" className="rounded-full px-10 py-6 text-lg font-semibold bg-primary hover:bg-primary/90">
            Empezar Gratis Ahora
          </CTAButton>

        </div>
      </div>
    </section>
  );
};

export default PricingSection;