const steps = [
  {
    num: "1.",
    title: "Upload your current resume",
    image: "https://jobowl.co/old_profile.png",
  },
  {
    num: "2.",
    title: "Provide the job description",
    image: "https://jobowl.co/li_job.png",
  },
  {
    num: "3.",
    title: "JobOwl generates a tailored resume",
    subtitle: "JobOwl generates a resume tailored to the job requirements",
    image: "https://jobowl.co/sample_resume.png",
  },
];

const HowItWorks = () => {
  return (
    <section className="bg-lavender py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">How JobOwl works</h2>
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
            <div key={step.num} className="bg-card rounded-xl overflow-hidden shadow-lg border">
              <img src={step.image} alt={step.title} className="w-full h-auto" loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
