import { ArrowRight } from "lucide-react";
import CTAButton from "./CTAButton";

const changes = [
  "Añadida cláusula sobre disposición para aprender Java y Spring Boot.",
  "Redactados puntos clave de 'checkout' y 'promociones' para resaltar el uso de tests A/B.",
  "Inclusión de la palabra clave 'Rest API'.",
  "Posicionamiento de 'React' como la habilidad más relevante.",
];

const ResumeExample = () => {
  return (
    <section className="py-20 px-4 bg-white border-y border-border">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-2">Ejemplo de adaptación con CVealo</h2>
        <p className="text-center text-muted-foreground mb-10">Mira los cambios que realiza CVealo automáticamente.</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Resume preview */}
          <div className="bg-card rounded-xl overflow-hidden shadow-sm border border-border">
            <div className="flex gap-2 p-3 border-b">
              <span className="bg-primary/20 text-primary text-xs font-semibold px-3 py-1 rounded-full">Currículum Original</span>
              <span className="text-xs px-3 py-1 rounded-full text-muted-foreground">Oferta de ejemplo</span>
            </div>
            <img src="https://jobowl.co/sample-resume.png" alt="Vista previa de CV adaptado" className="w-full" loading="lazy" />
          </div>

          {/* Changes list */}
          <div>
            <div className="space-y-4 mb-8">
              {changes.map((change, i) => (
                <div key={i} className="flex gap-3 items-start bg-card rounded-lg p-4 border border-border shadow-sm">
                  <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-accent-foreground">{i + 1}</span>
                  </div>
                  <p className="text-sm">{change}</p>
                </div>
              ))}
            </div>

            <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
              <h3 className="font-bold mb-3">Cambios típicos que hace CVealo</h3>
              <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                <li>• Añade palabras clave faltantes encontradas en la descripción.</li>
                <li>• Reescribe puntos de experiencia para coincidir con los objetivos del puesto.</li>
                <li>• Reordena habilidades clave para que sean fáciles de escanear.</li>
              </ul>
              <CTAButton size="lg" className="rounded-full px-8 py-5 text-base font-semibold gap-2 w-full">
                ¡Adaptar mi CV ahora! <ArrowRight className="w-5 h-5" />
              </CTAButton>
            </div>
            {/*<p className="mt-3 text-xs text-muted-foreground text-center">Empieza gratis · Sin tarjeta de crédito</p> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResumeExample;