import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQViewModel } from "@/lib/viewmodels";

const faqs: FAQViewModel[] = [
  {
    question: "¿Cómo me ayuda CurriAI a conseguir más entrevistas?",
    answer: "CurriAI crea una versión de tu currículum específica para cada puesto analizando la descripción de la oferta y destacando lo que más les importa a los reclutadores: tus habilidades más relevantes, tu experiencia más sólida y tus logros alineados con el rol. También añade palabras clave de forma natural y mantiene una estructura limpia (compatible con ATS).",
  },
  {
    question: "¿Qué significa 'adaptar' un currículum?",
    answer: "Adaptar significa alinear tu CV con un puesto específico, sin inventar nada. CurriAI puede reordenar habilidades, reescribir puntos de experiencia para reflejar mejor los resultados buscados, resaltar los proyectos más relevantes e incorporar frases clave de la descripción del trabajo.",
  },
  {
    question: "¿CurriAI funciona en otros idiomas?",
    answer: "Sí. CurriAI detecta el idioma de la oferta de trabajo y adapta tu CV en consecuencia. Funciona correctamente para los idiomas más hablados.",
  },
  {
    question: "¿CurriAI cambiará mi experiencia o añadirá información falsa?",
    answer: "No. CurriAI está diseñado para presentar tu experiencia real de forma más clara para el puesto que buscas. Mejora la redacción, estructura y énfasis, pero no inventa logros. Tú siempre tienes el control y puedes editar el CV generado.",
  },
  {
    question: "¿Necesito pegar una descripción de trabajo cada vez?",
    answer: "Para obtener los mejores resultados, sí, porque cada puesto prioriza habilidades y resultados diferentes. Pegar la descripción permite a CurriAI adaptar el currículum exactamente a esa oferta.",
  },
  {
    question: "¿Qué es un ATS y cómo ayuda CurriAI?",
    answer: "Un ATS (Sistema de Seguimiento de Candidatos) es un software que muchas empresas usan para filtrar solicitudes. CurriAI utiliza plantillas amigables para ATS y un formato limpio, para que tu CV sea fácil de procesar por estos sistemas.",
  },
  {
    question: "¿Mi CV sonará robótico?",
    answer: "No. CurriAI busca un lenguaje natural y profesional. Mantiene tu contenido legible mientras mejora la claridad y relevancia para el reclutador.",
  },
  {
    question: "¿Cuánto tiempo tarda en generarse un CV adaptado?",
    answer: "Normalmente menos de un minuto. Subes tu currículum, pegas la descripción del puesto y CurriAI genera la versión adaptada rápidamente.",
  },
  {
    question: "¿Puedo usar CurriAI para diferentes sectores e industrias?",
    answer: "Sí. CurriAI funciona en todos los sectores (tecnología, marketing, finanzas, operaciones, salud y más). Al adaptarse a la descripción del puesto, utiliza la terminología específica de cada industria.",
  },
];

const FAQSection = () => {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Preguntas Frecuentes</h2>
        <Accordion type="single" collapsible className="space-y-2">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="border border-border rounded-lg px-4">
              <AccordionTrigger className="text-left font-semibold text-sm py-4">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground pb-4">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
