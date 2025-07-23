import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-card border-b border-border shadow-soft sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-medical rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-medical bg-clip-text text-transparent">
                  MediConnect
                </h1>
                <span className="text-xs text-muted-foreground">Healthcare API</span>
              </div>
            </Link>
            <span className="text-xs text-muted-foreground border-l pl-4">
              by Nubits.AI Technology LLP
            </span>
          </div>
          
          <nav className="flex items-center space-x-6">
            <Link 
              to="/api-docs" 
              className="text-foreground hover:text-primary transition-colors"
            >
              API Docs
            </Link>
            <a 
              href="#demo" 
              className="text-foreground hover:text-primary transition-colors"
            >
              Demo
            </a>
            <a 
              href="#contact" 
              className="text-foreground hover:text-primary transition-colors"
            >
              Contact
            </a>
            <Button variant="hero" size="sm">
              Get Early Access
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;