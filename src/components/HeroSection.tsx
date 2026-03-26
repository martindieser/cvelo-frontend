import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import tailoringMachine from "@/assets/tailoring-machine.png";

const jobCards = [
  { icon: "in", title: "Social Media Manager", company: "AmazingCompany" },
  { icon: "i", title: "PR Consultant", company: "AmazingCompany" },
  { icon: "g", title: "Marketing Specialist", company: "CoolCompany" },
];

const resumeCards = [
  { name: "John Smith", location: "Austin, Texas", email: "john.smith@mail.me", summary: "Perfect candidate for Marketing Specialist" },
  { name: "John Smith", location: "Austin, Texas", email: "john.smith@mail.me", summary: "Top candidate for Social Media Manager" },
  { name: "John Smith", location: "Austin, Texas", email: "john.smith@mail.me", summary: "Amazing candidate for PR Consultant" },
];

const HeroSection = () => {
  return (
    <section className="text-center pt-8 pb-0 overflow-hidden">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-5xl md:text-6xl lg:text-7xl leading-tight mb-6">
          <span className="font-display italic inline-block bg-accent px-6 py-2 rounded-xl -rotate-1 mb-2">
            Tailor your <span className="font-bold not-italic font-body">Resume</span>
          </span>
          <br />
          <span className="font-light">to any </span>
          <span className="font-bold">Job Description</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Paste in a job description and get a version of your resume tailored to what that role requires.
        </p>
        <Button size="lg" className="rounded-full px-8 py-6 text-lg font-semibold gap-2">
          Tailor My Resume! <ArrowRight className="w-5 h-5" />
        </Button>
        <p className="mt-4 text-sm text-muted-foreground">
          55000+ tailored resumes · 4.94/5 ⭐ (394{" "}
          <a href="#" className="underline">reviews</a>)
        </p>
      </div>

      {/* Machine illustration */}
      <div className="relative mt-8 h-[350px] md:h-[450px]">
        <img
          src={tailoringMachine}
          alt="Resume tailoring machine"
          className="absolute left-1/2 -translate-x-1/2 top-0 w-[280px] md:w-[350px] z-10"
        />
        {/* Resume cards floating right */}
        <div className="absolute right-[5%] md:right-[10%] top-[10%] flex gap-4">
          {resumeCards.map((card, i) => (
            <div key={i} className="bg-card border rounded-lg p-3 w-[180px] shadow-md text-left text-xs">
              <div className="flex justify-between mb-1">
                <span className="font-bold text-sm">{card.name}</span>
                <div className="text-right">
                  <div className="text-[10px]">{card.location}</div>
                  <div className="text-[10px] text-muted-foreground">{card.email}</div>
                </div>
              </div>
              <p className="font-medium mt-2">{card.summary}</p>
              <div className="mt-2 space-y-1">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="h-1.5 bg-muted rounded-full" style={{ width: `${70 + j * 8}%` }} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Warning sign */}
        <div className="absolute left-[55%] top-[45%] bg-warning rounded-lg p-2 text-xs font-bold text-center border-2 border-foreground z-20 rotate-3">
          <div className="text-2xl">⚠️</div>
          <div>Don't touch!</div>
          <div className="text-[10px] font-normal mt-1">JobOwl is getting<br/>people hired now</div>
        </div>
      </div>

      {/* Job cards marquee */}
      <div className="bg-lavender py-3 -mt-4 relative z-30 overflow-hidden border-y-2 border-foreground">
        <div className="flex animate-marquee">
          {[...jobCards, ...jobCards, ...jobCards, ...jobCards].map((card, i) => (
            <div key={i} className="flex items-center gap-3 bg-card border rounded-lg px-4 py-2 mx-3 min-w-[220px] shadow-sm">
              <div className="w-8 h-8 bg-muted rounded-md flex items-center justify-center text-xs font-bold">
                {card.icon}
              </div>
              <div className="text-left">
                <div className="font-semibold text-sm">{card.title}</div>
                <div className="text-xs text-muted-foreground">at {card.company}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
