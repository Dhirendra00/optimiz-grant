import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  FileText,
  Target,
  Users,
  TrendingUp,
  Search,
  Building,
  HandshakeIcon,
  CheckSquare,
  FolderKanban,
  Lightbulb,
  ArrowRight,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const iconMap: Record<string, React.ReactNode> = {
  FileText: <FileText className="h-10 w-10" />,
  FolderKanban: <FolderKanban className="h-10 w-10" />,
  Lightbulb: <Lightbulb className="h-10 w-10" />,
  Users: <Users className="h-10 w-10" />,
  Target: <Target className="h-10 w-10" />,
  HandshakeIcon: <HandshakeIcon className="h-10 w-10" />,
  CheckSquare: <CheckSquare className="h-10 w-10" />,
  Search: <Search className="h-10 w-10" />,
  Building: <Building className="h-10 w-10" />,
  TrendingUp: <TrendingUp className="h-10 w-10" />,
};

interface ServiceData {
  id: string;
  name: string;
  short_description: string | null;
  detailed_description: string | null;
  features_list: string[] | null;
  icon: string | null;
  display_order: number | null;
}

const Services = () => {
  const [services, setServices] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase
        .from("service_descriptions")
        .select("*")
        .order("display_order", { ascending: true });

      if (!error && data) {
        setServices(data);
      }
      setLoading(false);
    };
    fetchServices();
  }, []);

  const process = [
    { step: "01", title: "Discovery", description: "We learn about your organization, goals, and funding needs" },
    { step: "02", title: "Strategy", description: "Develop a tailored approach to maximize your funding success" },
    { step: "03", title: "Implementation", description: "Execute the plan with expert guidance and support" },
    { step: "04", title: "Reporting", description: "Measure impact and ensure accountability to funders" },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="section-navy py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-4">
              What We Offer
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Services</h1>
            <p className="text-xl text-primary-foreground/80">
              Our team will work collaboratively with you to develop customized solutions that drive results and maximize your funding potential
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="shadow-card">
                    <CardHeader>
                      <Skeleton className="w-16 h-16 rounded-xl mb-4" />
                      <Skeleton className="h-6 w-3/4" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                  </Card>
                ))
              : services.map((service) => (
                  <Card
                    key={service.id}
                    className="group shadow-card hover:shadow-card-hover transition-all duration-300 border-2 border-transparent hover:border-feature/20"
                  >
                    <CardHeader>
                      <div className="icon-container w-16 h-16 mb-4 text-feature group-hover:scale-110 transition-transform">
                        {service.icon && iconMap[service.icon] ? iconMap[service.icon] : <FileText className="h-10 w-10" />}
                      </div>
                      <CardTitle className="text-2xl">{service.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base mb-4">
                        {service.short_description || service.detailed_description || ""}
                      </CardDescription>
                      <Link
                        to="/contact"
                        className="inline-flex items-center text-feature font-medium text-sm hover:gap-2 transition-all"
                      >
                        Learn More <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </CardContent>
                  </Card>
                ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 md:py-28 section-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block text-feature font-semibold text-sm uppercase tracking-wider mb-4">
              How We Work
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Our Process</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A proven approach to grant success
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((item, index) => (
              <div key={index} className="text-center group">
                <div className="w-20 h-20 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6 group-hover:bg-feature transition-colors">
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
                Ready to Transform Your Funding Strategy?
              </h2>
              <p className="text-xl mb-10 text-primary-foreground/80 max-w-2xl mx-auto">
                Let's discuss how our services can help your organization achieve its funding goals
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold" asChild>
                  <Link to="/contact">Schedule Consultation</Link>
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
                  <Link to="/pricing">View Pricing</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Services;
