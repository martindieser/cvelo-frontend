import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const changes = [
  "Added a clause about eagerness to learn Java and Spring Boot.",
  "Rephrased the checkout and promotions bullet to stress the use of A-B testing.",
  "Include 'Rest API' keyword",
  "Place 'React' as the most relevant skill",
];

const ResumeExample = () => {
  return (
    <section className="py-20 px-4 bg-muted">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-2">JobOwl Resume Tailoring example</h2>
        <p className="text-center text-muted-foreground mb-10">See what changes JobOwl makes.</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Resume preview */}
          <div className="bg-card rounded-xl overflow-hidden shadow-lg border">
            <div className="flex gap-2 p-3 border-b">
              <span className="bg-primary/20 text-primary text-xs font-semibold px-3 py-1 rounded-full">Original resume</span>
              <span className="text-xs px-3 py-1 rounded-full text-muted-foreground">Example job</span>
            </div>
            <img src="https://jobowl.co/sample-resume.png" alt="Sample tailored resume preview" className="w-full" loading="lazy" />
          </div>

          {/* Changes list */}
          <div>
            <div className="space-y-4 mb-8">
              {changes.map((change, i) => (
                <div key={i} className="flex gap-3 items-start bg-card rounded-lg p-4 border shadow-sm">
                  <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold">{i + 1}</span>
                  </div>
                  <p className="text-sm">{change}</p>
                </div>
              ))}
            </div>

            <div className="bg-card rounded-xl p-6 border">
              <h3 className="font-bold mb-3">Example changes JobOwl makes</h3>
              <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                <li>• Added missing keywords found in the job description.</li>
                <li>• Reworded bullets to match the role's outcomes.</li>
                <li>• Re-ordered key skills so they're easier to scan.</li>
              </ul>
              <Button size="lg" className="rounded-full px-8 py-5 text-base font-semibold gap-2 w-full">
                Tailor My Resume! <ArrowRight className="w-5 h-5" />
              </Button>
              <p className="mt-3 text-xs text-muted-foreground text-center">Free to start · No credit card required</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResumeExample;
