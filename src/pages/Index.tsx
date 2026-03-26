import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import FeaturesSection from "@/components/FeaturesSection";
import ResumeExample from "@/components/ResumeExample";
import Testimonials from "@/components/Testimonials";
import ExpertSection from "@/components/ExpertSection";
import FAQSection from "@/components/FAQSection";
import PricingSection from "@/components/PricingSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <HowItWorks />
      <FeaturesSection />
      <ResumeExample />
      <PricingSection />
      {/*<Testimonials />*/}
      {/*<ExpertSection />*/}
      <FAQSection />
      <Footer />
    </div>
  );
};

export default Index;
