const ExpertSection = () => {
  return (
    <section className="py-20 px-4 bg-muted/20 border-y border-border">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12">
          ¡Creado en colaboración con<br />Expertos!
        </h2>
        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm max-w-2xl mx-auto">
          <div className="flex flex-col items-center gap-4 mb-6">
            <img
              src="https://jobowl.co/images/experts/maja_stankiewicz_avatar.jpg"
              alt="Maja Stankiewicz"
              className="w-20 h-20 rounded-full object-cover"
              loading="lazy"
            />
            <div>
              <h3 className="font-bold text-lg">Maja Stankiewicz</h3>
              <p className="text-sm text-muted-foreground">Career Coach y Psicóloga</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6 text-left">
            "Hola, soy Maja. Ayudo a estudiantes, profesionales y gerentes a encontrar carreras que se ajusten a sus metas y valores. Utilizo estrategias no tradicionales para acceder al mercado laboral oculto y destacar entre los candidatos."
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6 text-left">
            "Me asocié con <strong className="text-foreground">CurriAI</strong> para dar a mis clientes una ventaja: automatiza los ajustes del currículum para cada oferta, asegurando que cumplan con los estándares ATS sin el esfuerzo manual."
          </p>
          <a href="#" className="text-primary font-semibold text-sm underline">
            ¡Contáctame para asesoramiento profesional!
          </a>
        </div>
      </div>
    </section>
  );
};

export default ExpertSection;
