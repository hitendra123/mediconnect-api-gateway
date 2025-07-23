import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";

const ProblemSolution = () => {
  const problems = [
    "Healthcare systems speak different languages (HL7, FHIR, EDI)",
    "Building converters takes weeks of specialized knowledge",
    "Maintaining conversion code is complex and error-prone",
    "Each integration requires custom development",
    "No standardized validation or error handling"
  ];

  const solutions = [
    "One API endpoint for all conversions",
    "Battle-tested conversion logic",
    "99.9% uptime SLA",
    "Integration in minutes, not weeks",
    "Built-in validation and error handling"
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold text-foreground mb-4">
            The Healthcare Integration Challenge
          </h3>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Healthcare data integration shouldn't consume months of development time. 
            See how MediConnect transforms the process.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Problem Card */}
          <Card className="border-destructive/20 bg-gradient-to-br from-red-50 to-red-100 animate-fade-in">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-destructive flex items-center gap-2">
                <XCircle className="w-6 h-6" />
                The Problem
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {problems.map((problem, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{problem}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Solution Card */}
          <Card className="border-success/20 bg-gradient-to-br from-green-50 to-green-100 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-success flex items-center gap-2">
                <CheckCircle className="w-6 h-6" />
                Our Solution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {solutions.map((solution, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{solution}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolution;