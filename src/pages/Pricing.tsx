import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";

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
      <section className="bg-muted/50 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Subscription Plans</h1>
            <p className="text-xl text-muted-foreground">
              Choose the plan that fits your organization's needs and unlock the power of strategic grant success
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`shadow-card hover:shadow-card-hover transition-all ${
                  plan.highlighted ? "border-primary border-2 scale-105" : ""
                }`}
              >
                {plan.highlighted && (
                  <div className="bg-primary text-primary-foreground text-center py-2 font-semibold rounded-t-lg">
                    Most Popular
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-3xl">{plan.name}</CardTitle>
                  <CardDescription className="text-lg">{plan.subtitle}</CardDescription>
                  <p className="text-muted-foreground mt-2">{plan.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <Check className="h-5 w-5 text-accent mr-2 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
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
            <Card className="bg-accent/5 border-accent">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-center">Special Partner Discounts</h3>
                <p className="text-muted-foreground text-center">
                  Existing partners receive up to 75% discount on Premium Plan and 70% on Standard Plan
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How to Subscribe */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How to Subscribe</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get started in four simple steps
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {process.map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Card className="bg-primary text-primary-foreground shadow-card-hover">
            <CardContent className="p-8 md:p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Not Sure Which Plan is Right for You?
              </h2>
              <p className="text-xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
                Contact us for a personalized consultation and we'll help you choose the best option
              </p>
              <Button size="lg" variant="secondary" asChild>
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
