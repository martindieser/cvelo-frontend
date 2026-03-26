const ExpertSection = () => {
  return (
    <section className="py-20 px-4 bg-muted">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12">
          Built in Collaboration with<br />Experts!
        </h2>
        <div className="bg-card border rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
          <div className="flex flex-col items-center gap-4 mb-6">
            <img
              src="https://jobowl.co/images/experts/maja_stankiewicz_avatar.jpg"
              alt="Maja Stankiewicz"
              className="w-20 h-20 rounded-full object-cover"
              loading="lazy"
            />
            <div>
              <h3 className="font-bold text-lg">Maja Stankiewicz</h3>
              <p className="text-sm text-muted-foreground">Career Coach & Psychologist</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            Hi, I'm Maja. I help students, professionals, and experienced managers find careers that fit their goals and values. 
            I use non-traditional strategies to access the hidden job market, stand out from other candidates, and build confidence for interviews.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            I partnered with <strong className="text-foreground">JobOwl</strong> to give my clients an edge: it automates resume adjustments 
            for every job description, ensuring they meet ATS standards without the manual effort.
          </p>
          <a href="#" className="text-primary font-semibold text-sm underline">
            Contact me for career advice!
          </a>
        </div>
      </div>
    </section>
  );
};

export default ExpertSection;
