import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, 
  Shield, 
  Zap, 
  CheckCircle2, 
  Code, 
  Clock,
  Database,
  Globe
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: FileText,
      title: "Multiple Message Types",
      description: "Support for ADT, ORU (Lab Results), ORM (Orders), MDM (Documents), RDE (Pharmacy), DFT (Billing), SIU (Scheduling)",
      delay: "0s"
    },
    {
      icon: Shield,
      title: "FHIR Validation",
      description: "Built-in validation ensures your FHIR resources meet R4 standards with detailed error reporting",
      delay: "0.1s"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Average response time under 100ms with 99.9% uptime SLA for mission-critical integrations",
      delay: "0.2s"
    },
    {
      icon: Code,
      title: "Intelligent Mapping",
      description: "Context-aware conversion based on message type and content with smart field mapping",
      delay: "0.3s"
    },
    {
      icon: Database,
      title: "EDI Support",
      description: "Complete EDI transaction support including 837 (Claims), 835 (Payments), 270 (Eligibility), 271 (Response)",
      delay: "0.4s"
    },
    {
      icon: Globe,
      title: "RESTful API",
      description: "Simple REST endpoints with comprehensive documentation and interactive testing tools",
      delay: "0.5s"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold text-foreground mb-4">
            Advanced Healthcare Integration Features
          </h3>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to build robust healthcare integrations with confidence
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index} 
                className="text-center border-border hover:shadow-medical transition-all duration-300 hover:scale-105 animate-fade-in bg-gradient-card"
                style={{ animationDelay: feature.delay }}
              >
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-medical rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-foreground">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Benefits */}
        <div className="mt-16 bg-card border border-border rounded-xl p-8 shadow-soft">
          <h4 className="text-2xl font-bold text-foreground mb-6 text-center">
            Enterprise-Ready Features
          </h4>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: CheckCircle2, text: "HIPAA Compliant" },
              { icon: Clock, text: "24/7 Monitoring" },
              { icon: Shield, text: "SOC 2 Certified" },
              { icon: Database, text: "Auto Scaling" }
            ].map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-success" />
                  <span className="text-foreground font-medium">{benefit.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;