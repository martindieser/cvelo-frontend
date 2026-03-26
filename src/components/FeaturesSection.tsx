import { ArrowRight, FileText, Target, Search, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: FileText,
    title: "Clear resume templates",
    description: "Our templates are easily readable by ATS systems, ensuring your resume gets past the initial screening.",
  },
  {
    icon: Target,
    title: "Look like a clear role fit",
    description: "Reframes your experience and reorders skills so the role's priorities show up instantly, so recruiters see the match in seconds.",
  },
  {
    icon: Search,
    title: "Injects relevant keywords",
    description: "Takes most important keywords from the job description and adds them naturally to your resume.",
  },
  {
    icon: TrendingUp,
    title: "Higher reported interview rates",
    description: "Users report an increase in interview invitations after using JobOwl to tailor their resumes.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Stop rewriting your resume for every role</h2>
        <p className="text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
          Generate a job-specific resume in seconds, based on your real experience and skills.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {features.map((feature) => (
            <div key={feature.title} className="bg-muted rounded-xl p-6 text-left">
              <feature.icon className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
        <Button size="lg" className="rounded-full px-8 py-6 text-lg font-semibold gap-2">
          Tailor My Resume! <ArrowRight className="w-5 h-5" />
        </Button>
        <p className="mt-3 text-sm text-muted-foreground">Free to start · No credit card required</p>
      </div>
    </section>
  );
};

export default FeaturesSection;
