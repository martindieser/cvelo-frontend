import { useState, useEffect } from "react";
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
import LoadingScreen from "@/components/LoadingScreen";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulamos un tiempo de carga de 2 segundos
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

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
