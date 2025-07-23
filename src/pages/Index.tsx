import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProblemSolution from "@/components/ProblemSolution";
import FormatComparison from "@/components/FormatComparison";
import Features from "@/components/Features";
import Demo from "@/components/Demo";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <ProblemSolution />
      <FormatComparison />
      <Features />
      <Demo />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
