import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, CheckCircle2 } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, send to backend
    console.log("Contact form submitted:", formData);
    setIsSubmitted(true);
    
    // Optional: Open email client
    const subject = encodeURIComponent("MediConnect API - Enterprise Inquiry");
    const body = encodeURIComponent(`Hello,

I'm interested in MediConnect API for healthcare data integration.

Name: ${formData.name}
Company: ${formData.company}
Email: ${formData.email}

Message:
${formData.message}

Please contact me to discuss integration requirements and pricing.

Thank you!`);
    
    setTimeout(() => {
      window.location.href = `mailto:contact@nubitsaitech.com?subject=${subject}&body=${body}`;
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (isSubmitted) {
    return (
      <section id="contact" className="py-20 bg-gradient-hero">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-card rounded-xl p-8 shadow-medical">
            <CheckCircle2 className="w-16 h-16 text-success mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-foreground mb-4">
              Thank You!
            </h3>
            <p className="text-xl text-muted-foreground mb-6">
              We'll be in touch soon to discuss your healthcare integration needs.
            </p>
            <Badge className="bg-success text-white">
              Response within 24 hours
            </Badge>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-20 bg-gradient-hero">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h3 className="text-4xl font-bold text-white mb-4">
            Get Early Access
          </h3>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Be among the first to simplify your healthcare integrations.
            Contact us to discuss your requirements and get early access.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card className="shadow-medical">
            <CardHeader>
              <CardTitle>Contact Our Team</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Name *
                    </label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Company
                    </label>
                    <Input
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Your company"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Email *
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your@email.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Message
                  </label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your integration needs..."
                    rows={4}
                  />
                </div>
                
                <Button type="submit" variant="medical" size="lg" className="w-full">
                  Get Started
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="space-y-6">
            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardContent className="p-6">
                <h4 className="text-xl font-bold text-white mb-4">
                  Enterprise Solutions Available
                </h4>
                <ul className="space-y-3 text-white/90">
                  <li>• Custom integrations and workflows</li>
                  <li>• On-premise deployment options</li>
                  <li>• Dedicated support and SLAs</li>
                  <li>• HIPAA-compliant infrastructure</li>
                  <li>• Volume pricing and contracts</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardContent className="p-6">
                <h4 className="text-xl font-bold text-white mb-4">
                  Contact Information
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-white/90">
                    <Mail className="w-5 h-5" />
                    <span>contact@nubitsaitech.com</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/90">
                    <Phone className="w-5 h-5" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/90">
                    <MapPin className="w-5 h-5" />
                    <span>Nubits.AI Technology LLP</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;