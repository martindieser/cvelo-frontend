import { CheckCircle } from "lucide-react";
import CTAButton from "./CTAButton";

const PricingSection = () => {
  return (
    <section className="py-20 px-4 bg-white" id="pricing">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-4 text-foreground">
          Precios Simples y Transparentes
        </h2>
        <p className="text-muted-foreground text-center mb-12 text-lg">
          Impulsa tu carrera con planes que se adaptan a ti.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          {/* Starter */}
          <div className="bg-card border-2 border-border rounded-3xl p-8 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow duration-300">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-center mb-1 text-muted-foreground uppercase tracking-wider text-sm">Plan Inicial</h3>
              <p className="text-5xl font-bold text-center mb-1">Gratis</p>
              <p className="text-sm text-muted-foreground text-center mb-8">(¡sin tarjeta de crédito!)</p>
              
              <div className="space-y-4 mb-8">
                {[
                  "Genera 3 CVs adaptados gratis",
                  "Cartas de presentación básicas",
                  "Exportación a PDF",
                  "Soporte estándar",
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="text-sm font-medium text-foreground/80">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <CTAButton 
              className="w-full rounded-full py-6 text-lg font-bold bg-secondary hover:bg-secondary/80 text-secondary-foreground border-none"
              to="/onboarding"
            >
              Empezar Gratis
            </CTAButton>
          </div>

          {/* Pro */}
          <div className="bg-card border-2 border-primary rounded-3xl p-8 shadow-xl relative flex flex-col h-full ring-4 ring-primary/5 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-6 py-1.5 rounded-full shadow-lg">
              RECOMENDADO
            </div>
            
            <div className="flex-1">
              <h3 className="text-xl font-bold text-center mb-1 text-primary uppercase tracking-wider text-sm">CVealo Pro</h3>
              <p className="text-center mb-6">
                <span className="text-5xl font-bold">24,99€</span>
                <span className="text-muted-foreground font-medium text-lg">/mes</span>
              </p>
              
              <div className="space-y-4 mb-8">
                {[
                  "Generación ilimitada de CVs adaptados",
                  "Cartas de presentación ilimitadas",
                  "CVs con tono personalizado",
                  "Soporte prioritario",
                  "Sin marcas de agua",
                  "Análisis de ATS avanzado"
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="text-sm font-semibold">{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="bg-warning/15 rounded-2xl p-4 border border-warning/30 mb-8">
                <p className="font-bold text-sm text-warning-foreground">¡Más entrevistas o te devolvemos el dinero!</p>
                <p className="text-xs text-foreground/70 mt-1">
                  Si no consigues más entrevistas tras usar CVealo, puedes solicitar un reembolso.{" "}
                  <a href="#" className="underline font-medium hover:text-primary transition-colors">Ver reglas</a>.
                </p>
              </div>
            </div>

            <CTAButton 
              className="w-full rounded-full py-6 text-lg font-bold bg-primary hover:bg-primary/90 shadow-md border-none"
              to="/login"
            >
              Obtener Pro
            </CTAButton>
          </div>
        </div>
        
        <p className="text-center mt-12 text-muted-foreground text-sm">
          ¿Tienes dudas sobre los planes? <a href="#faq" className="underline font-medium hover:text-primary transition-colors">Consulta nuestras FAQ</a>.
        </p>
      </div>
    </section>
  );
};

export default PricingSection;