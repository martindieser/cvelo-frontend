import { StepViewModel } from "@/lib/viewmodels";

const steps: StepViewModel[] = [
  {
    num: "1.",
    title: "Sube tu currículum actual",
    image: "https://jobowl.co/old_profile.png",
  },
  {
    num: "2.",
    title: "Pega la descripción del puesto",
    image: "https://jobowl.co/li_job.png",
  },
  {
    num: "3.",
    title: "CVealo genera un CV adaptado",
    subtitle: "CVealo genera un currículum optimizado para los requisitos del puesto",
    image: "https://jobowl.co/sample_resume.png",
  },
];

const HowItWorks = () => {
  return (
    <section className="bg-white py-20 px-4 border-b border-border">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">Cómo funciona CVealo</h2>
        <div className="flex flex-col md:flex-row gap-4 mb-8 justify-center">
          {steps.map((step) => (
            <div key={step.num} className="flex items-center gap-2">
              <span className="bg-accent text-accent-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                {step.num}
              </span>
              <span className="font-semibold">{step.title}</span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.num} className="bg-card rounded-xl overflow-hidden shadow-sm border border-border">
              <img src={step.image} alt={step.title} className="w-full h-auto" loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
