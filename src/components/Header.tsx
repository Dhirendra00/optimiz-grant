import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/logo.jpeg";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, primaryRole, signOut } = useAuth();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Team", path: "/team" },
    { name: "Pricing", path: "/pricing" },
    { name: "Opportunities", path: "/opportunities" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-primary text-primary-foreground shadow-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-3">
          <img 
            src={logo} 
            alt="OptimizGrant Logo"
            className="h-10 w-10 object-contain rounded-lg"
          />
          <span className="text-xl font-bold text-primary-foreground">OptimizGrant</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="px-4 py-2 text-sm font-medium text-primary-foreground/80 transition-colors hover:text-accent rounded-lg hover:bg-primary-foreground/10"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center space-x-3">
          {user ? (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-accent"
                asChild
              >
                <Link to={primaryRole === "admin" ? "/admin" : "/dashboard"}>
                  Dashboard
                </Link>
              </Button>
              <Button 
                size="sm" 
                className="bg-accent text-accent-foreground hover:bg-accent/90"
                onClick={signOut}
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-accent"
                asChild
              >
                <Link to="/login">Login</Link>
              </Button>
              <Button 
                size="sm" 
                className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
                asChild
              >
                <Link to="/register">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-primary-foreground"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-primary-foreground/20 bg-primary">
          <nav className="container mx-auto flex flex-col space-y-2 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="px-4 py-2 text-sm font-medium text-primary-foreground/80 transition-colors hover:text-accent hover:bg-primary-foreground/10 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex flex-col space-y-2 pt-4 border-t border-primary-foreground/20">
              {user ? (
                <>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-accent justify-start"
                    asChild
                  >
                    <Link to={primaryRole === "admin" ? "/admin" : "/dashboard"}>
                      Dashboard
                    </Link>
                  </Button>
                  <Button 
                    size="sm" 
                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                    onClick={signOut}
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-accent justify-start"
                    asChild
                  >
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button 
                    size="sm" 
                    className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
                    asChild
                  >
                    <Link to="/register">Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
