import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import {
  FileText,
  Target,
  Users,
  TrendingUp,
  Award,
  CheckCircle,
  BarChart,
  Globe,
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
} from "lucide-react";

const Home = () => {
  const services = [
    {
      icon: <FileText className="h-8 w-8" />,
      title: "Grant Writing",
      description: "Expert proposal writing to maximize your funding success",
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Grant Strategy",
      description: "Strategic planning to identify and secure the right grants",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Capacity Building",
      description: "Strengthen your organization's grant management capabilities",
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Project Management",
      description: "Professional oversight ensuring successful project delivery",
    },
  ];

  const stats = [
    { label: "Success Rate", value: "95%", icon: <Award className="h-6 w-6" /> },
    { label: "Grants Secured", value: "$50M+", icon: <TrendingUp className="h-6 w-6" /> },
    { label: "Clients Served", value: "500+", icon: <Users className="h-6 w-6" /> },
    { label: "Countries", value: "15+", icon: <Globe className="h-6 w-6" /> },
  ];

  const benefits = [
    {
      icon: <Shield className="h-6 w-6 text-feature" />,
      text: "Proven track record with 95% success rate",
    },
    {
      icon: <Sparkles className="h-6 w-6 text-feature" />,
      text: "Customized solutions tailored to your needs",
    },
    {
      icon: <Globe className="h-6 w-6 text-feature" />,
      text: "Global expertise with local insights",
    },
    {
      icon: <BarChart className="h-6 w-6 text-feature" />,
      text: "Measurable results and transparent reporting",
    },
    {
      icon: <Award className="h-6 w-6 text-feature" />,
      text: "Expert team with decades of experience",
    },
    {
      icon: <Zap className="h-6 w-6 text-feature" />,
      text: "End-to-end support from strategy to delivery",
    },
  ];

  const trustedBy = [
    "Non-Profit Organizations",
    "Educational Institutions", 
    "Healthcare Providers",
    "Community Groups",
    "Research Institutes",
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative section-navy py-20 md:py-32 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-feature/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary-foreground/10 rounded-full px-4 py-2 mb-6 backdrop-blur-sm border border-primary-foreground/20">
              <Sparkles className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-primary-foreground/90">
                Trusted Grant Consulting Partner
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              From Pipeline{" "}
              <span className="text-gradient-accent">to Profit</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-foreground/80 max-w-2xl mx-auto">
              Your trusted partner in grant consulting, strategy development, and project implementation
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-base px-8"
                asChild
              >
                <Link to="/register">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-semibold text-base"
                asChild
              >
                <Link to="/contact">Book Consultation</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Marquee */}
      <section className="py-6 bg-muted/50 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Trusted by:</span>
            {trustedBy.map((org, index) => (
              <span key={index} className="whitespace-nowrap">{org}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block text-feature font-semibold text-sm uppercase tracking-wider mb-4">
              What We Offer
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Our Services</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive grant solutions to help your organization thrive
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card 
                key={index} 
                className="group shadow-card hover:shadow-card-hover transition-all duration-300 border-2 border-transparent hover:border-feature/20"
              >
                <CardContent className="pt-8 pb-6 px-6">
                  <div className="icon-container w-14 h-14 mb-6 text-feature group-hover:scale-110 transition-transform">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                  <p className="text-muted-foreground mb-4">{service.description}</p>
                  <Link 
                    to="/services" 
                    className="inline-flex items-center text-feature font-medium text-sm hover:gap-2 transition-all"
                  >
                    Learn more <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" asChild>
              <Link to="/services">View All Services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 md:py-28 section-light">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block text-feature font-semibold text-sm uppercase tracking-wider mb-4">
                Why Choose Us
              </span>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                All your grant processes in one place
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Partner with experts who deliver results. We provide real-time reporting you can trust, with comprehensive support at every step.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">{benefit.icon}</div>
                    <p className="text-foreground">{benefit.text}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <div 
                  key={index} 
                  className="stats-card"
                >
                  <div className="flex justify-center mb-3 text-accent">{stat.icon}</div>
                  <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
                  <div className="text-sm text-primary-foreground/70">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 md:py-28 bg-feature text-feature-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-6xl mb-8 opacity-50">"</div>
            <blockquote className="text-2xl md:text-3xl font-medium mb-8 leading-relaxed">
              OptimizGrant is the best investment we have made as an organization, and I would absolutely recommend it to any non-profit that wants to understand exactly what is making them money, and where all the time is being spent.
            </blockquote>
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-full bg-feature-foreground/20 flex items-center justify-center">
                <Users className="h-6 w-6" />
              </div>
              <div className="text-left">
                <div className="font-semibold">Community Foundation</div>
                <div className="text-sm text-feature-foreground/70">Non-Profit Organization</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lead Capture Banner */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <Card className="shadow-card-hover border-2 border-border overflow-hidden">
            <CardContent className="p-0">
              <div className="grid lg:grid-cols-2">
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <BarChart className="h-12 w-12 text-feature mb-6" />
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Ready to Get More Funding?
                  </h2>
                  <p className="text-lg text-muted-foreground mb-8">
                    Join hundreds of organizations that have increased their funding with our expert guidance
                  </p>
                  <form className="flex flex-col sm:flex-row gap-4">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      className="flex-1"
                    />
                    <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90">
                      Subscribe
                    </Button>
                  </form>
                  <p className="text-sm text-muted-foreground mt-4">
                    Get exclusive insights and grant opportunities delivered to your inbox
                  </p>
                </div>
                <div className="hidden lg:block bg-hero-gradient" />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 section-navy">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Start Your Success Story Today
          </h2>
          <p className="text-xl mb-10 text-primary-foreground/80 max-w-2xl mx-auto">
            Let's work together to secure the funding your organization deserves
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-base px-8"
              asChild
            >
              <Link to="/register">Register Your Organization</Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              asChild
            >
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
