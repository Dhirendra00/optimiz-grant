import { Link } from "react-router-dom";
import { Linkedin, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";
import logo from "@/assets/logo.jpeg";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-3 mb-6">
              <img 
                src={logo} 
                alt="OptimizGrant Logo"
                className="h-10 w-10 object-contain rounded-lg"
              />
              <span className="text-xl font-bold text-primary-foreground">OptimizGrant</span>
            </Link>
            <p className="text-primary-foreground/70 text-sm mb-6">
              Your trusted partner in grant consulting, strategy development, and project implementation.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-primary-foreground/60 hover:text-accent transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-accent transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-accent transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-accent transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-lg mb-6 text-primary-foreground">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/team" className="text-primary-foreground/70 hover:text-accent transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/team" className="text-primary-foreground/70 hover:text-accent transition-colors text-sm">
                  Our Team
                </Link>
              </li>
              <li>
                <Link to="/opportunities" className="text-primary-foreground/70 hover:text-accent transition-colors text-sm">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/opportunities" className="text-primary-foreground/70 hover:text-accent transition-colors text-sm">
                  Become a Partner
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-lg mb-6 text-primary-foreground">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/services" className="text-primary-foreground/70 hover:text-accent transition-colors text-sm">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-primary-foreground/70 hover:text-accent transition-colors text-sm">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-primary-foreground/70 hover:text-accent transition-colors text-sm">
                  FAQs
                </Link>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/70 hover:text-accent transition-colors text-sm">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/70 hover:text-accent transition-colors text-sm">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-6 text-primary-foreground">Contact</h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-start space-x-3 text-primary-foreground/70">
                <MapPin size={18} className="flex-shrink-0 mt-0.5" />
                <span>39 Gwingana Cres, Glen Waverly VIC 3150, Australia</span>
              </div>
              <div className="flex items-center space-x-3 text-primary-foreground/70">
                <Mail size={18} className="flex-shrink-0" />
                <span>info@optimizgrant.com</span>
              </div>
              <div className="flex items-center space-x-3 text-primary-foreground/70">
                <Phone size={18} className="flex-shrink-0" />
                <span>+61 426 086 532</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/20 text-center text-sm text-primary-foreground/60">
          <p>&copy; {new Date().getFullYear()} OptimizGrant. (Australian Professional Consulting Group Pty Ltd)</p>
          <p className="mt-2">All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
