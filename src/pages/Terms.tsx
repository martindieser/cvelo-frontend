import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background font-body">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-16 md:py-24">
        <h1 className="text-4xl font-black mb-8">Términos y Condiciones</h1>
        <div className="prose prose-slate max-w-none space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">1. Aceptación de los Términos</h2>
            <p>
              Al acceder y utilizar CurriAI, usted acepta cumplir y estar sujeto a estos Términos y Condiciones. Si no está de acuerdo con alguna parte de estos términos, no podrá utilizar nuestro servicio.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">2. Descripción del Servicio</h2>
            <p>
              CurriAI es una plataforma impulsada por inteligencia artificial diseñada para ayudar a los usuarios a optimizar y adaptar sus currículums a ofertas de trabajo específicas. Nos reservamos el derecho de modificar o interrumpir el servicio en cualquier momento.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">3. Cuentas de Usuario</h2>
            <p>
              Para utilizar ciertas funciones del servicio, debe registrarse para obtener una cuenta. Usted es responsable de mantener la confidencialidad de su contraseña y de todas las actividades que ocurran bajo su cuenta.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">4. Propiedad Intelectual</h2>
            <p>
              Todo el contenido y la tecnología de CurriAI son propiedad exclusiva nuestra o de nuestros licenciantes. El uso del servicio no le otorga ningún derecho de propiedad sobre nuestros activos intelectuales.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">5. Limitación de Responsabilidad</h2>
            <p>
              CurriAI no garantiza el éxito en la obtención de empleo. El servicio se proporciona "tal cual" y no seremos responsables de ningún daño directo, indirecto o consecuente derivado del uso de la plataforma.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
