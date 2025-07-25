import { Button } from "@/components/ui/button";
import { Activity, Zap, Shield } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative py-20 px-4 bg-gradient-hero overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-white/5 rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 right-1/3 w-8 h-8 bg-white/5 rounded-full animate-bounce delay-500"></div>
      </div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-hero opacity-90" />
      
      {/* Content */}
      <div className="relative max-w-6xl mx-auto text-center">
        <div className="animate-fade-in">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Stop Wasting Developer Hours on<br />
            <span className="text-primary-glow">Healthcare Data Formats</span>
          </h2>
          
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            Convert between HL7, FHIR, and EDI formats with a single API call.<br />
            What takes weeks of development now takes seconds.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Button 
              variant="hero" 
              size="xl"
              className="animate-scale-in"
              onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
            >
              See Live Demo
            </Button>
            <Button 
              variant="outline" 
              size="xl"
              className="border-white/30 text-white hover:bg-white/10 animate-scale-in"
              style={{ animationDelay: '0.1s' }}
            >
              View Documentation
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-center mb-3">
                <div className="p-3 bg-white/20 rounded-full">
                  <Shield className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-2">99.9%</div>
              <div className="text-white/80">Uptime SLA</div>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center justify-center mb-3">
                <div className="p-3 bg-white/20 rounded-full">
                  <Zap className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-2">&lt;100ms</div>
              <div className="text-white/80">Average Response</div>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center justify-center mb-3">
                <div className="p-3 bg-white/20 rounded-full">
                  <Activity className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-2">10+</div>
              <div className="text-white/80">Message Types</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;