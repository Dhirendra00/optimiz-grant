import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check, Star, Sparkles } from "lucide-react";

const Pricing = () => {
  const plans = [
    {
      name: "Standard Plan",
      subtitle: "General Subscription",
      description: "Perfect for organizations starting their grant journey",
      features: [
        "Monthly grant opportunity updates",
        "Access to grant writing templates",
        "Email support",
        "Quarterly webinars and training",
        "Basic eligibility assessment",
        "Grant calendar access",
      ],
      cta: "Get Started",
    },
    {
      name: "Premium Plan",
      subtitle: "Advance Subscription",
      description: "Comprehensive support for serious grant seekers",
      features: [
        "Everything in Standard Plan",
        "Weekly personalized grant matches",
        "Priority email and phone support",
        "Monthly one-on-one consultation (1 hour)",
        "Detailed proposal reviews and feedback",
        "Custom grant strategy sessions",
        "Access to exclusive funder networks",
        "Advanced eligibility analysis with AI",
        "Unlimited template access",
        "Monthly networking events",
      ],
      cta: "Go Premium",
      highlighted: true,
    },
  ];

  const process = [
    {
      step: "1",
      title: "Choose Your Plan",
      description: "Select the subscription that best fits your organization's needs",
    },
    {
      step: "2",
      title: "Complete Registration",
      description: "Register your organization with basic information",
    },
    {
      step: "3",
      title: "Make Payment",
      description: "Secure payment processing with multiple options",
    },
    {
      step: "4",
      title: "Start Accessing Benefits",
      description: "Immediately access all plan features and resources",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="section-navy py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-4">
              Simple Pricing
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Subscription Plans</h1>
            <p className="text-xl text-primary-foreground/80">
              Choose the plan that fits your organization's needs and unlock the power of strategic grant success
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`relative shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden ${
                  plan.highlighted ? "border-2 border-feature scale-[1.02]" : "border-2 border-transparent hover:border-feature/20"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute top-0 left-0 right-0 bg-feature text-feature-foreground text-center py-2 font-semibold text-sm flex items-center justify-center gap-2">
                    <Star className="h-4 w-4" />
                    Most Popular
                  </div>
                )}
                <CardHeader className={plan.highlighted ? "pt-12" : ""}>
                  <CardTitle className="text-3xl">{plan.name}</CardTitle>
                  <CardDescription className="text-lg text-feature font-medium">{plan.subtitle}</CardDescription>
                  <p className="text-muted-foreground mt-2">{plan.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center mr-3 mt-0.5">
                          <Check className="h-3 w-3 text-accent" />
                        </div>
                        <span className="text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${plan.highlighted ? "bg-feature hover:bg-feature/90 text-feature-foreground" : ""}`}
                    size="lg"
                    variant={plan.highlighted ? "default" : "outline"}
                    asChild
                  >
                    <Link to="/register">{plan.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Special Offers */}
          <div className="mt-12 max-w-3xl mx-auto">
            <Card className="bg-accent/10 border-accent/30 shadow-card">
              <CardContent className="p-8 flex items-center gap-4">
                <div className="icon-container-accent w-14 h-14 flex-shrink-0">
                  <Sparkles className="h-7 w-7 text-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">Special Partner Discounts</h3>
                  <p className="text-muted-foreground">
                    Existing partners receive up to 75% discount on Premium Plan and 70% on Standard Plan
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How to Subscribe */}
      <section className="py-20 md:py-28 section-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block text-feature font-semibold text-sm uppercase tracking-wider mb-4">
              Getting Started
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">How to Subscribe</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get started in four simple steps
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {process.map((item, index) => (
              <div key={index} className="text-center group">
                <div className="w-20 h-20 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center text-3xl font-bold mx-auto mb-6 group-hover:bg-feature transition-colors">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <Card className="section-navy shadow-card-hover overflow-hidden">
            <CardContent className="p-8 md:p-16 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary-foreground">
                Not Sure Which Plan is Right for You?
              </h2>
              <p className="text-xl mb-10 text-primary-foreground/80 max-w-2xl mx-auto">
                Contact us for a personalized consultation and we'll help you choose the best option
              </p>
              <Button 
                size="lg" 
                className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
                asChild
              >
                <Link to="/contact">Schedule Consultation</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
