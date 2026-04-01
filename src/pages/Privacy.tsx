import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background font-body">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-16 md:py-24">
        <h1 className="text-4xl font-black mb-8">Política de Privacidad</h1>
        <div className="prose prose-slate max-w-none space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">1. Información que Recopilamos</h2>
            <p>
              Recopilamos información que usted nos proporciona directamente, como su nombre, correo electrónico y el contenido de los currículums que sube a la plataforma para su procesamiento por nuestra IA.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">2. Uso de la Información</h2>
            <p>
              Utilizamos su información únicamente para proporcionar y mejorar nuestros servicios de optimización de currículums, comunicarnos con usted sobre su cuenta y garantizar la seguridad de nuestra plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">3. Procesamiento por IA</h2>
            <p>
              Al subir su CV, usted acepta que nuestra inteligencia artificial procese sus datos personales con el único fin de generar sugerencias de mejora y adaptaciones. Sus datos no se utilizan para entrenar modelos públicos sin su consentimiento explícito.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">4. Protección de Datos</h2>
            <p>
              Implementamos medidas de seguridad técnicas y organizativas para proteger su información personal. Nunca venderemos sus datos a terceros.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">5. Sus Derechos</h2>
            <p>
              Usted tiene derecho a acceder, corregir o eliminar su información personal en cualquier momento a través de la configuración de su perfil o contactando con nuestro soporte.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
