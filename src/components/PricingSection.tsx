import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const PricingSection = () => {
  return (
    <section className="py-20 px-4 bg-lavender">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Simple, Transparent Pricing</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Starter */}
          <div className="bg-card border-2 border-foreground rounded-2xl p-8">
            <h3 className="text-xl font-bold text-center mb-1">Starter Plan</h3>
            <p className="text-4xl font-bold text-center mb-1">Free</p>
            <p className="text-sm text-muted-foreground text-center mb-8">(no credit card required!)</p>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-accent" />
              <span className="text-sm">Generate 3 Tailored Resumes for Free</span>
            </div>
          </div>

          {/* Pro */}
          <div className="bg-card border-2 border-foreground rounded-2xl p-8">
            <h3 className="text-xl font-bold text-center mb-1">JobOwl Pro</h3>
            <p className="text-center mb-6">
              <span className="text-4xl font-bold">$24.99</span>
              <span className="text-muted-foreground">/month</span>
            </p>
            <div className="space-y-3 mb-6">
              {[
                "Generate Unlimited Tailored Resumes",
                "Generate Unlimited Tailored Cover-Letters",
                "Vibe-Matched Resumes",
                "Priority Support",
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
            <div className="bg-warning rounded-xl p-4 border border-foreground/20">
              <p className="font-bold text-sm">More Job interviews or Money Back!</p>
              <p className="text-xs text-foreground/70 mt-1">
                If you don't land more job interviews after using JobOwl, you can request a refund.{" "}
                <a href="#" className="underline font-medium">See rules</a>.
              </p>
            </div>
          </div>
        </div>
        <div className="text-center mt-10">
          <Button size="lg" className="rounded-full px-10 py-6 text-lg font-semibold">
            Get Started for Free
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
