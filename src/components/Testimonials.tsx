import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Gabriela A.",
    date: "9 Nov 2025",
    text: "Conseguí 2 entrevistas en una semana, realmente deberían probarlo.",
    avatar: "https://jobowl.co/golda.png",
  },
  {
    name: "Leonardo G.",
    date: "8 Oct 2025",
    text: "Empecé a usarlo hace unos días y ya tengo tres entrevistas agendadas. Es una herramienta valiosísima.",
    avatar: "https://jobowl.co/logan.jpg",
  },
  {
    name: "Juliana S.",
    date: "8 Oct 2025",
    text: "He empezado a recibir llamadas mucho más seguido. Una herramienta excelente.",
    avatar: "https://jobowl.co/juliana.jpg",
  },
  {
    name: "Nancy H.",
    date: "26 Ago 2025",
    text: "No estaba segura de que funcionaría, pero mis solicitudes de entrevista han aumentado desde que uso CurriAI :-)",
    avatar: "https://jobowl.co/nancy.jpg",
  },
  {
    name: "Mellony B.",
    date: "10 Oct 2025",
    text: "Tengo 55 años y 22 de experiencia. Empezar de cero es difícil y CurriAI realmente me ha ayudado con mis CVs y la redacción.",
    avatar: "https://jobowl.co/mello.png",
  },
  {
    name: "Keishia T.",
    date: "27 Oct 2025",
    text: "¡Me encanta CurriAI! Hace que aplicar a trabajos sea mucho más fácil y rápido. ¡Realmente funciona!",
    avatar: "https://jobowl.co/keish.png",
  },
];

const Testimonials = () => {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Lo que dicen quienes ya lo usan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" loading="lazy" />
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.date}</div>
                </div>
              </div>
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                ))}
              </div>
              <p className="text-sm text-foreground leading-relaxed">{t.text}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <a href="#" className="text-primary font-semibold underline text-sm">Ver todas las reseñas</a>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
